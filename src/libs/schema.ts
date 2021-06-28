import {
    array,
    object,
    string,
    number,
    boolean,
} from 'zod';

export const TodoItem = object({
    id: string().optional(),
    username: string(),
    label: string(),
    completed: boolean(),
    createdAt: number().optional(),
    updatedAt: number().optional(),
});
export const TodoItems = array(TodoItem);
export const UpdateTodoItem = object({
    id: string(),
    label: string().optional(),
    completed: boolean().optional(),
    updatedAt: number().optional(),
});

export const CreateTodoItemRequest = TodoItem;
export const CreateTodoItemResponse = object({
    id: string(),
});

export const GetTodoItemRequest = object({
    todoItemId: string(),
    username:string(),
    fields: string().optional(),
});
export const GetTodoItemResponse = TodoItem;
export const ListTodoItemsRequest = object({
    username:string(),
    limit: number().optional(),
    fields: string().optional(),
    lek: string().optional(),
});
export const ListTodoItemsResponse = TodoItems;
export const UpdateTodoItemRequest = UpdateTodoItem;
export const UpdateTodoItemResponse = TodoItem;
export const DeleteTodoItemRequest = object({
    todoItemId: string(),
    username:string(),
});
export const DeleteTodoItemResponse = TodoItem;