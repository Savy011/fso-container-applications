const { JWT_SECRET } = require('../utils/config')
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtracter } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	
	response.status(200).json(blogs)
})

blogsRouter.post('/', userExtracter, async (request, response) => {
	const user = await User.findById(request.user)

	const blog = new Blog({
		...request.body,
		user: request.user
	})

	if (!blog.likes) {
		blog.likes = 0
	}
	
	if (!blog.title || !blog.url) {
		response.status(400).send({ error: 'Missing Title or Url' })
	}

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	
	response.status(201).json(savedBlog)
})

blogsRouter.post('/:id/comments', userExtracter, async (request, response) => {
    const { comment } = request.body
    const blogToAddComment = await Blog.findById(request.params.id)

    blogToAddComment.comments = blogToAddComment.comments.concat(comment)
    await blogToAddComment.save()

    response.status(201).end()
})

blogsRouter.delete('/:id', userExtracter, async (request, response) => {
	const blogToDel = await Blog.findById(request.params.id)

	if (!(blogToDel.user.toString() === request.user.toString())) {
		return response.status(401).json({
			error: 'You must be the blog owner to delete it'
		})
	}
	
	await Blog.findByIdAndRemove(request.params.id)

	response.status(200).json({
		message: 'Requested blog was deleted'
	})
})

blogsRouter.put('/:id', userExtracter ,async (request, response) => {
	const { likes } = request.body

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, context: 'query' })
	response.status(201).json(updatedBlog)
})

module.exports = blogsRouter
