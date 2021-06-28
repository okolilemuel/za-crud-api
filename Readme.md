# ZA CRUD API

## About ℹ️

This project is a simple Todo Crud API which lets a user create, read, list, update, and delete todo items. The API validates user input and returns appropriate responses or error messages with generic HTTP status codes.

Since the API validates user input, and Typescript was used in its development, it made sense to have a single source of schema and type/interface definition. The easiest way to achieve this was to use a schema declaration and validation library to declare schemas and infer types from them. This approach made it possible to have custom types generated from validation schema and reduced the amount of code needed to be written and maintained.

A username is required in consuming the API. This is because of how complex it is to fetch items in an orderd and sorted manner from DynamoDB. To be able to fetch a user's todo entries from the db sorted in a descending manner, a Global Secondary Index was defined with the username as Hash, and the date as Range. This made it possible to run a scan on the DB with the username and date as filter expression to get a user's todo entries in an ascending ordered manner. The final action was to reverse the todo entries to achieve the descending order which was required.

The API makes use of a mix of the request body, query parameters, and path parametres. It made sense to extract the needed request properties at the handler level and build out the appropriate request object which matches the controlllers parameter types. These request objects are then validated at the controller level using the appropriate schema which also matches the controller's parameter type. Finally, if the validation is passed, the paramters object is passed down to the model.

If a user sends in a wrong requets input, the request will quickly fail the validation test and the user will get a status 400 error with a concise message informing what went wrong.

## Docs 📄

[API Documentation](https://documenter.getpostman.com/view/2412192/Tzef9NYx)

## Getting Started 🏁

The instructions below will help you get your copy of the API up and running on your local machine.

### Prerequisites

To be able to run this API on your machine, you will need the following already setup:

- Nodejs `12.x` or `14.x`
- Serverl`ess Framework installed globally
- Typescript installed globally
- Active AWS account
- AWS developer creds stored in `./aws/credentials/`

### Installing 📦

```bash
npm install
```

### Local Usage 🤖

```bash
sls offline start -s [stage]
```

### Deployment 🚀

```bash
serverless deploy -s [stage]
```

## Testing 🧪

The unit tests are based on `Mocha` and `Chai`, and  relies on a local instance of `Dynalite` (an implementation of Amazon's DynamoDB built on LevelDB for fast in-memory or persistent usage), for DB simulation/mocking. Integration tests are carried out on an actual deployed instance of the app on AWS using the `Supertest` package.

### Running Unit Tests

```bash
npm run test:unit
```

### Running Integration Tests

```bash
npm run test:integration
```

## Built Using  ⛏️  <a name = "built_using"></a>

- [Typescript](https://www.typescriptlang.org/) - Application Language
- [Serverless Framework](https://www.serverless.com/) - Server Environment Provisisoning
- [Dynamodb](https://aws.amazon.com/dynamodb/) - Database
- [Lambda](https://aws.amazon.com/lambda/) - Compute
- [API Gateway](https://aws.amazon.com/api-gateway/) - API Maintainance
- [Dynalite](https://www.npmjs.com/package/dynalite) - In-memory Implementation of DynamoDB
- [Serverless-webpack](https://www.npmjs.com/package/serverless-webpack) - Build Tool
- [Supertest](https://www.npmjs.com/package/supertest) - HTTP Assertions
- [Mocha](https://mochajs.org/) - Tetsing Framework
- [Chai](https://www.chaijs.com/) - Assertion Library
