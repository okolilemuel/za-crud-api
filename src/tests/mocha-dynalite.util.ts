const AWS = require('aws-sdk');
const yaml = require('js-yaml');
const fs = require('fs');
const { CLOUDFORMATION_SCHEMA } = require('cloudformation-js-yaml-schema');
const dynalite = require('dynalite');

const dynaliteServer = dynalite({ createTableMs: 50 });

export const port = 4567;

export const mockDB = () => {
    AWS.config.update({
        region: process.env.REGION,
    });

    const dynamodb = new AWS.DynamoDB({
        endpoint: `http://localhost:${port}`
    });

    return new Promise((resolve, reject) => {
        dynaliteServer.listen(port, () => {
            dynamodb.listTables({}, (err: any, data: any) => {
                if (err) console.log(err, err.stack);
                else {
                    const cf = yaml.load(fs.readFileSync('./resources.yml', 'utf8'), {
                        schema: CLOUDFORMATION_SCHEMA,
                    });

                    const tables: any = [];
                    // @ts-ignore
                    Object.keys(cf.Resources).forEach((item) => tables.push(cf.Resources[item]));
                    const todoTable = tables
                        .filter((r: any) => r.Type === 'AWS::DynamoDB::Table')
                        .map((r: any) => {
                            let table = r.Properties;

                            // required for jest-dynalite, not valid in cloudformation template
                            // table.StreamSpecification.StreamEnabled = false;

                            table.TableName = table.TableName.replace(
                                '${self:custom.stage}',
                                process.env.STAGE || 'test',
                            );

                            // errors on dynamo-local
                            delete table.TimeToLiveSpecification;

                            return table;
                        })
                        .filter((r: any) => r.TableName === process.env.TODO_TABLE)[0];
                    if (data.TableNames!.length <= 0) {
                        dynamodb.createTable(todoTable, (err: any, data: any) => {
                            if (err) {
                                console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
                                reject(err);
                            } else {
                                setTimeout(() => {
                                    resolve(data);
                                }, 1000);
                            }
                        });
                    } else { resolve(true); }
                }
            });
        });
    });
}
