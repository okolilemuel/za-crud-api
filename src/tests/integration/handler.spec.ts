process.env.STAGE = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const { v4: uuid } = require('uuid');

const server = request('https://sq97sh86mi.execute-api.eu-west-2.amazonaws.com/test');
const testTodoId = uuid();
const mockRequest = {
	id: testTodoId,
	username: 'tester',
	label: 'test todo',
	completed: false,
}

describe('Todo API integration tests', function () {
	describe('POST /todo', function () {
		it('should create a todo item', function (done) {
			server
				.post('/todo')
				.send(mockRequest)
				.set('Accept', 'application/json')
				.expect(200)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.body.id).to.be.equal(mockRequest.id);
					return done();
				});
		});
		it('should throw validation error if a todo item property is invalid', function(done) {
			server
				.post('/todo')
				.send({
					username: mockRequest.username,
				})
				.set('Accept', 'application/json')
				.expect(400)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.error).to.exist;
					return done();
				});
		});
	});

	describe('Get todo item tests', function() {
		it('should create a todo item', function(done) {
			server
				.get(`/todo/${mockRequest.username}/${testTodoId}`)
				.set('Accept', 'application/json')
				.expect(200)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.body.id).to.be.equal(mockRequest.id);
					return done();
				});
		});
		it('should error on attempt to get a non existing todo item', function(done) {
			server
				.get(`/todo/${mockRequest.username}/foobar`)
				.set('Accept', 'application/json')
				.expect(404)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.error).to.exist;
					return done();
				});
		});
	});

	describe('List todo items tests', function() {
		it('should list todo items', function(done) {
			server
				.get(`/todo/${mockRequest.username}`)
				.set('Accept', 'application/json')
				.expect(200)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.body.Items[0].id).to.exist;
					expect(result.body.Items[0].label).to.exist;
					expect(result.body.Items[0].completed).to.exist;
					return done();
				});
		});
		it('should list todo items with only selected fields/columns', function(done) {
			server
				.get(`/todo/${mockRequest.username}?fields=id,label`)
				.set('Accept', 'application/json')
				.expect(200)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.body.Items[0].completed).to.not.exist;
					return done();
				});
		});
	});

	describe('Update todo item tests', function() {
		it('should update todo item', function(done) {
			server
				.put('/todo')
				.set('Accept', 'application/json')
				.send({
					...mockRequest,
					completed: true,
				})
				.expect(200)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.body.completed).to.be.true;
					return done();
				});
		});
		it('should error on attempt to update a non existing todo item', function(done) {
			server
				.put('/todo')
				.set('Accept', 'application/json')
				.send({
					...mockRequest,
					id: 'foobar'
				})
				.expect(404)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.error).to.exist;
					return done();
				});
		});
	});

	describe('Delete todo item tests', function() {
		it('should delete todo item', function(done) {
			server
				.delete(`/todo/${mockRequest.username}/${testTodoId}`)
				.set('Accept', 'application/json')
				.expect(200)
				.end((error: any) => {
					if (error) return done(error);
					server
						.get(`/todo/${mockRequest.username}/${testTodoId}`)
						.set('Accept', 'application/json')
						.expect(404)
						.end((error: any, result: any) => {
							if (error) return done(error);
							expect(result.error).to.exist;
							return done();
						});
				});
		});
		it('should error on attempt to delete a non existing todo item', function(done) {
			server
				.delete(`/todo/${mockRequest.username}/${testTodoId}`)
				.set('Accept', 'application/json')
				.expect(404)
				.end((error: any, result: any) => {
					if (error) return done(error);
					expect(result.error).to.exist;
					return done();
				});
		});
	});
});
