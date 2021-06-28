import * as Todo from './todo.model';
import * as types from './libs/types';
import * as schema from './libs/schema';
import validate from './libs/validate';
import { ItemNotFoundError } from './libs/errors';

export async function createTodoItem(
  request: types.CreateTodoItemRequest,
): Promise<types.CreateTodoItemResponse> {
  validate(schema.CreateTodoItemRequest, request);
  const todoItem = await Todo.create(request);
  return { id: todoItem};
}

export async function getTodoItem(
  request: types.GetTodoItemRequest,
): Promise<types.GetTodoItemResponse> {
  validate(schema.GetTodoItemRequest, request);
  const { Item } = await Todo.get(request);
  if (!Item || Object.keys(Item).length === 0) {
    throw new ItemNotFoundError('Todo item not found');
  }
  return Item as types.GetTodoItemResponse;
}

export async function listTodoItems(
  request: types.ListTodoItemsRequest,
): Promise<types.ListTodoItemsResponse> {
  validate(schema.ListTodoItemsRequest, request);
  const result: any = await Todo.list(request);
  return {
    ...result,
    Items: result.Items.reverse(),
  }
}

export async function updateTodoItem(
  request: types.UpdateTodoItemRequest,
): Promise<types.UpdateTodoItemResponse> {
  validate(schema.UpdateTodoItemRequest, request);
  const { Attributes } = await Todo.update(request);
  return Attributes as types.UpdateTodoItemResponse;
}

export async function deleteTodoItem(
  request: types.DeleteTodoItemRequest,
): Promise<types.DeleteTodoItemResponse> {
  validate(schema.DeleteTodoItemRequest, request);
  const todoItem = await Todo.remove(
    request.todoItemId, request.username
  );
  if (!todoItem || Object.keys(todoItem).length === 0) {
    throw new ItemNotFoundError('Todo item does not exist');
  }
  return todoItem.Attributes as types.DeleteTodoItemResponse;
}
