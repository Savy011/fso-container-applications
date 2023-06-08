import { useEffect, useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import BlogForm from './components/BlogForm'
import NotifBox from './components/NotifBox'
import { useQuery } from 'react-query'
import { getAllBlogs, setToken } from './utils/requests'
import UserContext from './utils/UserContext'
import LoginForm from './components/LoginForm'
import TopMenu from './components/Menu'
import BlogList from './components/BlogList'
import Loading from './components/Loading'
import Error from './components/Error'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'
import { Container, Typography } from '@mui/material'

const App = () => {
    const [LoggedUser, userDispatch] = useContext(UserContext)

    const result = useQuery('blogs', getAllBlogs, { retry: 1 })
    const blogs = result.data

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            userDispatch({ type: 'SET_USER', payload: user })
            if (user.token) {
                setToken(user.token)
            }
        }
    }, [])

    const Blogs = () => {
        return (
            <div>
                <Typography
                    variant="h4"
                    sx={{ m: 2 }}
                >
                    Blog List
                </Typography>
                {result.isLoading ? (
                    <Loading />
                ) : result.isError ? (
                    <Error />
                ) : (
                    <BlogList blogs={blogs} />
                )}
            </div>
        )
    }

    if (LoggedUser === null) return <LoginForm />

    return (
        <Container>
            <div>
                <div className="app-container">
                    <TopMenu />
                    <NotifBox />

                    <Routes>
                        <Route
                            path="/"
                            element={<Blogs />}
                        />
                        <Route
                            path="/blogs"
                            element={
                                <Navigate
                                    replace
                                    to="/"
                                />
                            }
                        />
                        <Route
                            path="/blogs/:id"
                            element={<BlogView blogs={blogs} />}
                        />
                        <Route
                            path="/users"
                            element={<Users />}
                        />
                        <Route
                            path="/users/:id"
                            element={<User />}
                        />
                        <Route
                            path="/create"
                            element={<BlogForm />}
                        />
                    </Routes>
                </div>
            </div>
        </Container>
    )
}

export default App
