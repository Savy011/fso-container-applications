const { JWT_SECRET } = require('./config')
const jwt = require('jsonwebtoken')
const logger = require('./logger')

const requestLogger = (request, response, next) => {
	logger.info('Method:', request.method)
	logger.info('Path  :', request.path)
	logger.info('Body  :', request.body)
	logger.info('---------------------')
	next()
}

const tokenExtracter = (request, response, next) => {
	const authorization = request.get('authorization')

	if (authorization && authorization.startsWith('Bearer ')) {
		request.token = authorization.replace('Bearer ','')	
	}

	next()

}

const userExtracter = (request, response, next) => {
	if (!request.token) {
		return response.status(401).json({
			error: 'Token not found!'
		})
	}

	const decodedToken = jwt.verify(request.token, JWT_SECRET)

	if (!decodedToken.id) {
		return response.status(401).json({
			error: 'Invalid Token'
		})
	}
	
	request.user = decodedToken.id
	next()
}

const errorHandler = (error, request, response, next) => {
	logger.error(error)

	if (error.name === 'ValidationError') {
		return response.status(400).json({
			error: error.message
		})
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(400).json({
			error: error.message
		})

	} else if (error.name === 'TokenExpiredError') {
		 return response.status(401).json({
			 error: 'Token Expired'
		 })
	}

	next(error)
}

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'Unknown Endpoint' })
}

module.exports = {
	errorHandler,
	unknownEndpoint,
	requestLogger,
	tokenExtracter,
	userExtracter
}
