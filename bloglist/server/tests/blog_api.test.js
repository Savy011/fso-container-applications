const mongoose = require('mongoose')
const supertest = require('supertest')
const { initialBlogs, blogsInDB } = require('./test_helper')
const app = require ('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
	await User.deleteMany({})
	await Blog.deleteMany({})

	for (let blog of initialBlogs) {
		let blogObj = new Blog(blog)
		await blogObj.save()
	}
})

describe('When there are some Blogs saved initially', () => {
	let token

	beforeAll(async () => {
		const user = {
			username: 'testuser1',
			name: 'testuser1',
			password: 'testuser@1'
		}

		await api.post('/api/users').send(user).expect(201)

		const response = await api.post('/api/login').send(user).expect(200)

		token = response.body.token
	})

	test('Blogs are returned as JSON', async () => {
		await api
			.get('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

	})

	test('All blogs are returned', async () => {
		const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

		expect(response.body).toHaveLength(initialBlogs.length)
	})

	test('All blogs have a unique identifier property named \'id\'', async () => {
		const response = await api
			.get('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.expect(200)
		
		const retBlog = response.body[0]

		expect(retBlog.id).toBeDefined()
	})
})

describe('Addition of a Blog', () => {
	let token

	beforeAll(async () => {
		const user = {
			username: 'testuser1',
			name: 'testuser1',
			password: 'testuser@1'
		}

		await api.post('/api/users').send(user).expect(201)

		const response = await api.post('/api/login').send(user)

		token = response.body.token
	})

	test('a valid blog can be added', async () => {
		const newBlog = {
			title: "First class tests",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
			likes: 10,
		}
		
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)

		const blogsAtEnd = await blogsInDB()
		expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
		
		const titles = blogsAtEnd.map(n => n.title)
		expect(titles).toContain('First class tests')
	})

	test('A blog posted with no likes property has 0 likes by default', async () => {
		const newBlog = {
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		}
		
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)

		const blogsAtEnd = await blogsInDB()
		expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
	
		const addedBlog = blogsAtEnd.find(b => b.title === 'Canonical string reduction')
		expect(addedBlog.likes).toBe(0)
	})

	test('A blog posted with no title property returns Status Code 400', async () => {
		const newBlog = {
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		}
		
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
	})

	test('A blog posted with no url property returns Status Code 400', async () => {
		const newBlog = {
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
		}
		
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
	})
})

describe('Deletion of a Blog', () => {
	let token

	beforeAll(async () => {
		const user = {
			username: 'testuser1',
			name: 'testuser1',
			password: 'testuser@1'
		}

		await api.post('/api/users').send(user).expect(201)

		const response = await api.post('/api/login').send(user).expect(200)

		token = response.body.token
	})

	test('A blog can be deleted', async () => {
		const newBlog = {
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			likes: 45,
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		}

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
		
		const blogsBeforeDelete = await blogsInDB()
		expect(blogsBeforeDelete).toHaveLength(initialBlogs.length + 1)
		const blogToBeDeleted = blogsBeforeDelete.find(b => b.title === 'Canonical string reduction')
		
		await api
			.delete(`/api/blogs/${blogToBeDeleted.id}`)
			.set('Authorization', `Bearer ${token}`)

		const blogsInEnd = await blogsInDB()
		expect(blogsInEnd).toHaveLength(blogsBeforeDelete.length - 1)

	})
})

describe('Updating a Blog', () => {
	let token

	beforeAll(async () => {
		const user = {
			username: 'testuser1',
			name: 'testuser1',
			password: 'testuser@1'
		}

		await api.post('/api/users').send(user).expect(201)

		const response = await api.post('/api/login').send(user).expect(200)

		token = response.body.token
	})

	test('A valid blog can be updated', async () => {
		const newBlog = {
			title: "Type wars",
			author: "Robert C. Martin",
			url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
			likes: 2,
		}
		
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)

		const blogsBeforeUpdate = await blogsInDB()
		expect(blogsBeforeUpdate).toHaveLength(initialBlogs.length + 1)
		
		const blogToBeUpdated = blogsBeforeUpdate.find(b => b.title === 'Type wars')
		const UpdatedBlog = {
			...newBlog,
			likes: newBlog.likes + 1
		}

		await api
			.put(`/api/blogs/${blogToBeUpdated.id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(UpdatedBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
		
		const blogsInEnd = await blogsInDB()
		const UpdatedBlogInDb = blogsInEnd.find(b => b.title === 'Type wars')
		expect(UpdatedBlogInDb.likes).toBe(3)
	}, 7000)
})

afterAll(async () => {
	await mongoose.connection.close()
})
