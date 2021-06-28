import { v4 as uuidV4 } from 'uuid';
import {
    GetItemOutput,
    UpdateItemOutput,
    DeleteItemOutput,
} from 'aws-sdk/clients/dynamodb';
import DB from './libs/dynamodb';
import * as types from './libs/types';
import {
    prepareUpdateExpression,
    prepareExpressionAttributeValues,
} from './libs/helpers';

const { TODO_TABLE } = process.env;
if (!TODO_TABLE) {
    throw new Error('Todo db table name not set in process environment');
}

export async function create(
    todoItem: types.TodoItem
): Promise<string> {
    const timestamp = +new Date();
    todoItem.createdAt = timestamp;
    todoItem.updatedAt = timestamp;
    todoItem.id = todoItem.id || uuidV4();
    await DB.put({
        TableName: TODO_TABLE,
        Item: todoItem as types.TodoItem,
    }).promise();
    return todoItem.id;
}

export async function get(parameters: {
    todoItemId: string,
    username: string,
    fields?: string,
}): Promise<GetItemOutput> {
    return await DB.get({
        TableName: TODO_TABLE,
        Key: {
            id: parameters.todoItemId,
        },
        ProjectionExpression: parameters.fields,
    }).promise();
}

export async function list(options?: {
    username: string,
    lek?: string,
    limit?: number,
    fields?: string,
}): Promise<types.TodoItems> {
    return await DB.scan({
        TableName: TODO_TABLE,
        IndexName: 'user-index',
        FilterExpression: "username = :username and createdAt < :createdAt",
        ExpressionAttributeValues: {
            ":username": options?.username,
            ":createdAt": +new Date(),
        },
        Limit: options?.limit || 50,
        ProjectionExpression: options?.fields,
        ScanIndexForward: true,
        ExclusiveStartKey: options?.lek,
    }).promise();
}

export async function update(
    todoItem: types.UpdateTodoItem
): Promise<UpdateItemOutput> {
    const timestamp = +new Date();
    todoItem.updatedAt = timestamp;
    const todoItemId = todoItem.id;
    const item: any = { ...todoItem };
    delete item.id;
    delete item.username;
    return await DB.update({
        TableName: TODO_TABLE,
        Key: { id: todoItemId },
        Item: item,
        ConditionExpression: `id = :id and username = :username`,
        UpdateExpression: prepareUpdateExpression(item),
        ExpressionAttributeValues: prepareExpressionAttributeValues(todoItem),
        ReturnValues:'ALL_NEW',
    }).promise();
}

export async function remove(
    todoItemId: string,
    username: string
): Promise<DeleteItemOutput> {
    return await DB.delete({
        TableName: TODO_TABLE,
        Key: { id: todoItemId },
        ReturnValues: 'ALL_OLD',
    }).promise();
}
