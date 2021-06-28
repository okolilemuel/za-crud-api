import {
    errorResponse,
    resourceNotFoundErrorResponse,
    requestValidationErrorResponse,
} from './lambda-response';

export function prepareUpdateExpression(item: any) {
    let updateExpression: string = '';
    for (const property in item) {
        updateExpression += `${property} = :${property}, `;
    }
    updateExpression = updateExpression.substr(0, updateExpression.length - 2);
    return 'set ' + updateExpression;
}

export function prepareExpressionAttributeValues(item: any) {
    let expressionAttributeValues: any = {};
    for (const property in item) {
        expressionAttributeValues[`:${property}`] = item[property];
    }
    return expressionAttributeValues;
}

export function handleError(e: any) {
    console.error(e);
    if (e.name === 'RequestValidationError') {
        return requestValidationErrorResponse({ message: e.message || e });
    } else if (e.name === 'ItemNotFoundError') {
        return resourceNotFoundErrorResponse({ message: e.message || e });
    } else if (e.name === 'ConditionalCheckFailedException') {
        return resourceNotFoundErrorResponse({ message: 'Todo item does not exist' });
    }
    return errorResponse({ message: e.message || e });
}
