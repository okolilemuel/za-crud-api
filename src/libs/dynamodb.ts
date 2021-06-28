import { DynamoDB } from 'aws-sdk';

let dynamoDB: any;
if (process.env.STAGE === 'test') {
  dynamoDB = new DynamoDB.DocumentClient({
      endpoint: process.env.MOCK_DYNAMODB_ENDPOINT,
      sslEnabled: false,
      region: process.env.REGION,
    });
} else {
  dynamoDB = new DynamoDB.DocumentClient({
    region: process.env.REGION
  });
}
export default dynamoDB;
