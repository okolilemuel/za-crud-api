import * as z from 'zod';
import * as schema from './schema';

export type TodoItem = z.infer<typeof schema.TodoItem>;
export type TodoItems = z.infer<typeof schema.TodoItems>;
export type UpdateTodoItem = z.infer<typeof schema.UpdateTodoItem>;
export type CreateTodoItemRequest = z.infer<typeof schema.CreateTodoItemRequest>;
export type CreateTodoItemResponse = z.infer<typeof schema.CreateTodoItemResponse>;
export type GetTodoItemRequest = z.infer<typeof schema.GetTodoItemRequest>;
export type GetTodoItemResponse = z.infer<typeof schema.GetTodoItemResponse>;
export type ListTodoItemsRequest = z.infer<typeof schema.ListTodoItemsRequest>;
export type ListTodoItemsResponse = z.infer<typeof schema.ListTodoItemsResponse>;
export type UpdateTodoItemRequest = z.infer<typeof schema.UpdateTodoItemRequest>;
export type UpdateTodoItemResponse = z.infer<typeof schema.UpdateTodoItemResponse>;
export type DeleteTodoItemRequest = z.infer<typeof schema.DeleteTodoItemRequest>;
export type DeleteTodoItemResponse = z.infer<typeof schema.DeleteTodoItemResponse>;
