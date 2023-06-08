const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
	console.log(users)
	response.status(200).json(users)
})

usersRouter.post('/', async (request, response) => {
	const { username, name, password } = request.body
	
	if (username === undefined || password === undefined) {
		return response.status(400).json({ error: 'Username or password missing'})
	}

	if (password.length < 3) {
		return response.status(400).json({ error: 'Password must be atleast 3 characters long'})
	}

	const saltRounds = 11
	const passwordHash = await bcrypt.hash(password, saltRounds)

	const newUser = new User({
		username,
		name,
		passwordHash
	})

	const savedUser = await newUser.save()

	response.status(201).json(savedUser)
})

module.exports = usersRouter
