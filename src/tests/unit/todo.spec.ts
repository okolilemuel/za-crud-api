process.env.STAGE = 'test';
process.env.REGION = 'local';
process.env.TODO_TABLE = `todo-table-${process.env.STAGE}`;

import {
	ItemNotFoundError,
	RequestValidationError
} from '../../libs/errors';
const mochaDynalite = require('../mocha-dynalite.util');
const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
chai.use(require('chai-as-promised'));

process.env.MOCK_DYNAMODB_ENDPOINT = `http://localhost:${mochaDynalite.port}`;

const Todo = require('../../todo');
const mockRequest = {
	id: 'd6ee064e-f21f-46cd-84ed-8d0ecd0daf23',
	username: 'tester',
	label: 'test todo',
	completed: false,
}

describe('Todo controller tests', function() {
    before(function(done) {
		this.timeout(5000);
		mochaDynalite.mockDB().then(function(){
			done();
		})
		.catch(function(err: any){
			assert(false, 'Could not create the mock DB');
			done(err);
		});
	});

	describe('Create todo item tests', function() {
		it('should create a todo item', async function() {
			const todoItem = await Todo.createTodoItem(mockRequest);
			expect(todoItem.id).to.equal(mockRequest.id);
		});
		it('should throw validation error if a todo item property is invalid', async function() {
			await expect(
				Todo.getTodoItem({})
			).to.be.rejectedWith(RequestValidationError);
		});
	});

	describe('Get todo item tests', function() {
		it('should create a todo item', async function() {
			const todoItem = await Todo.getTodoItem({
				todoItemId: mockRequest.id,
				username: mockRequest.username,
			});
			expect(todoItem.id).to.equal(mockRequest.id);
		});
		it('should error on attempt to get a non existing todo item', async function() {
			await expect(
				Todo.getTodoItem({
					todoItemId: 'wrong id',
					username: mockRequest.username,
				})
			).to.be.rejectedWith(ItemNotFoundError);
		});
	});

	describe('List todo items tests', function() {
		it('should list todo items', async function() {
			const todoItems = await Todo.listTodoItems({
				username: mockRequest.username
			});
			expect(todoItems.Items[0].id).to.equal(mockRequest.id);
		});
		it('should list todo items with only selected fields/columns', async function() {
			const todoItems = await Todo.listTodoItems({
				fields: 'id,label',
				username: mockRequest.username,
			});
			expect(todoItems.Items[0]).to.deep.equal({
				id: mockRequest.id,
				label: mockRequest.label
			})
		});
	});

	describe('Update todo item tests', function() {
		it('should update todo item', async function() {
			const todoItem = await Todo.updateTodoItem({
				id: mockRequest.id,
				username: mockRequest.username,
				completed: true,
			});
			expect(todoItem.completed).to.equal(true);
		});
		it('should error on attempt to update a non existing todo item', async function() {
			await expect(
				Todo.updateTodoItem({
					id: 'wrong id',
					username: mockRequest.username,
				})
			).to.be.rejectedWith('The conditional request failed');
		});
	});

	describe('Delete todo item tests', function() {
		it('should delete todo item', async function() {
			const todoItem = await Todo.deleteTodoItem({
				todoItemId: mockRequest.id,
				username: mockRequest.username,
			});
			expect(todoItem.id).to.equal(mockRequest.id);
			await expect(
				Todo.getTodoItem({
					todoItemId: todoItem.id,
					username: mockRequest.username,
				})
			).to.be.rejectedWith(ItemNotFoundError);
		});
		it('should error on attempt to delete a non existing todo item', async function() {
			await expect(
				Todo.deleteTodoItem({
					todoItemId: 'wrong id',
					username: mockRequest.username,
				})
			).to.be.rejectedWith(ItemNotFoundError);
		});
	});
});
