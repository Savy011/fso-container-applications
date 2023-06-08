const _ = require('lodash')

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	let sum = 0
	const total = blogs.forEach(blog => sum += blog.likes)

	return blogs.length !== 0 ? sum : 0
}

const favBlog = (blogs) => {
	if (blogs.length === 0) {
		return {}
	} 

	const mostLikes = _.maxBy(blogs, 'likes').likes
	const favBlog = _.find(blogs, { likes: mostLikes })

	const retObj = {
		title: favBlog.title,
		author: favBlog.author,
		likes: favBlog.likes
	}

	return retObj
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0) {
		return undefined
	}
	
	const blogCount = _.countBy(blogs, 'author')
	
	const authorWithMostBlogs = _.maxBy(_.keys(blogCount), (author) => blogCount[author])

	return authorWithMostBlogs
}

const mostLikes = (blogs) => {
	if (blogs.length === 0) {
		return {}
	}

	const authorLikes = _.reduce(blogs, (result, blog) => {
		if (!result[blog.author]) {
			result[blog.author] = 0;
		}
		result[blog.author] += blog.likes
		return result
	}, {})
	
	const authorWithMostLikes = _.maxBy(_.keys(authorLikes), author => authorLikes[author] )
	
	const retObj = {
		author: authorWithMostLikes,
		likes: authorLikes[authorWithMostLikes]
	}
		
	return retObj
}

module.exports = {
	dummy,
	totalLikes,
	favBlog,
	mostBlogs,
	mostLikes
}
