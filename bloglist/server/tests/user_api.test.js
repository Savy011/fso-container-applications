const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const usersInDb = require("./test_helper").usersInDb

const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
	await User.deleteMany({})
})

describe('Addition of User', () => {
	test('a valid user is added', async () => {
		const newUser = {
			username: 'test',
			name: 'test1',
			password: 'test@123'
		}
		
		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await usersInDb()
		const usernames = usersAtEnd.map(u => u.username)
		
		expect(usernames).toContain('test')
	})
	
	test('a user without a unique username is not added', async () => {
		//TODO
		const firstUser = {
			username: 'test',
			name: 'test1',
			password: 'test@123'
		}

		const secondUser = {
			username: 'test',
			name: 'test2',
			password: 'test@321'
		}
		
		await api
			.post('/api/users')
			.send(firstUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		
		await api
			.post('/api/users')
			.send(secondUser)
			.expect(400)

		const usersAtEnd = await usersInDb()
		expect(usersAtEnd.length).toBe(1)
	})
	
	test('a user without password is not added', async () => {
		//TODO

		const newUser = {
			username: 'test3',
			name: 'test3',
		}
		
		await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
		
		const usersAtEnd = await usersInDb()
		expect(usersAtEnd.length).toBe(0)
	})

})

afterAll(async () => {
	await mongoose.connection.close()
})
