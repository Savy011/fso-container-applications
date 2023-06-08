import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/blogs'

let token = null

export const setToken = newToken => {
    token = `Bearer ${newToken}`
}

export const getAllBlogs = async () => {
    const response = await axios.get(baseUrl)

    return response.data
}

export const getAllUsers = async () => {
    const response = await axios.get('http://localhost:3001/api/users')

    return response.data
}

export const postBlog = async blogContents => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(baseUrl, blogContents, config)

    return response.data
}

export const postComment = async commentObj => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.post(
        `${baseUrl}/${commentObj.id}/comments`,
        commentObj,
        config
    )

    return response.data
}

export const putBlog = async blogContents => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.put(
        `${baseUrl}/${blogContents.id}`,
        blogContents,
        config
    )

    return response.data
}

export const removeBlog = async blogContents => {
    const config = {
        headers: { Authorization: token },
    }
    const response = await axios.delete(`${baseUrl}/${blogContents.id}`, config)

    return response.data
}
