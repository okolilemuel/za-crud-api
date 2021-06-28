import * as todo from './src/todo';
import { handleError } from './src/libs/helpers';
import { Response, successResponse } from './src/libs/lambda-response';

export async function CreateTodoItem(
  event: AWSLambda.APIGatewayEvent,
): Promise<Response> {
  try {
    const requestBody = JSON.parse(event.body!);
    return successResponse({
      ... await todo.createTodoItem(requestBody),
    });
  } catch (e) {
    return handleError(e);
  }
}

export async function GetTodoItem(
  event: AWSLambda.APIGatewayEvent,
): Promise<Response> {
  try {
    const username = event?.pathParameters?.username;
    const itemId = event?.pathParameters?.itemId;
    const fields = event?.queryStringParameters?.fields;
    return successResponse({
      ... await todo.getTodoItem({
        username: username!, todoItemId: itemId!, fields
      }),
    });
  } catch (e) {
    return handleError(e);
  }
}

export async function ListTodoItems(
  event: AWSLambda.APIGatewayEvent,
): Promise<Response> {
  try {
    const username = event?.pathParameters?.username;
    const fields = event?.queryStringParameters?.fields;
    const lek = event?.queryStringParameters?.lek;
    return successResponse({
      ... await todo.listTodoItems({ 
        username: username!, fields, lek
      }),
    });
  } catch (e) {
    return handleError(e);
  }
}

export async function UpdateTodoItem(
  event: AWSLambda.APIGatewayEvent,
): Promise<Response> {
  try {
    const requestBody = JSON.parse(event.body!);
    return successResponse({
      ... await todo.updateTodoItem(requestBody),
    });
  } catch (e) {
    return handleError(e);
  }
}

export async function DeleteTodoItem(
  event: AWSLambda.APIGatewayEvent,
): Promise<Response> {
  try {
    const username = event?.pathParameters?.username;
    const itemId = event?.pathParameters?.itemId;
    return successResponse({
      ... await todo.deleteTodoItem({
        todoItemId: itemId!, username: username!
      }),
    });
  } catch (e) {
    return handleError(e);
  }
}
