import { useField, removeReset } from '../utils/hooks'
import { useMutation, useQueryClient } from 'react-query'
import { postBlog } from '../utils/requests'
import { useNotification } from '../utils/NotifContext'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import { Card, TextField, Box, Typography } from '@mui/material'

const BlogForm = () => {
    const queryClient = useQueryClient()
    const setNotif = useNotification()
    const navigate = useNavigate()
    const title = useField('text')
    const author = useField('text')
    const url = useField('text')

    const createBlogMutation = useMutation(postBlog, {
        onSuccess: newBlog => {
            const blogsList = queryClient.getQueryData('blogs')
            queryClient.invalidateQueries('blogs', blogsList.concat(newBlog))
        },
    })

    const createBlog = async blogObj => {
        try {
            createBlogMutation.mutateAsync(blogObj)
            setNotif(
                `Blog '${blogObj.title}' by ${blogObj.author} added!`,
                'success',
                5000
            )
        } catch (err) {
            setNotif(
                `Error occured while creating '${blogObj.title}'`,
                'error',
                5000
            )
            console.log(err)
        }
    }

    const addBlog = event => {
        event.preventDefault()
        createBlog({
            title: title.value,
            author: author.value,
            url: url.value,
        })
        navigate('/')
        title.reset()
        author.reset()
        url.reset()
    }

    const resetField = event => {
        event.preventDefault()
        title.reset()
        author.reset()
        url.reset()
    }

    return (
        <div>
            <Card
                sx={{
                    mt: 2,
                    background: '#fffa',
                    borderRadius: 3,
                    border: 'solid',
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        m: 1,
                        fontFamily: 'Spline Sans',
                    }}
                >
                    Create New Blog
                </Typography>
                <form onSubmit={addBlog}>
                    <Box sx={{ m: 2 }}>
                        <div>
                            <TextField
                                sx={{ mt: 1, mb: 1 }}
                                fullWidth
                                label="Title"
                                {...removeReset(title)}
                            />
                        </div>
                        <div>
                            <TextField
                                sx={{ mt: 1, mb: 1 }}
                                fullWidth
                                label="Author"
                                {...removeReset(author)}
                            />
                        </div>
                        <div>
                            <TextField
                                sx={{ mt: 1, mb: 1 }}
                                fullWidth
                                label="URL"
                                {...removeReset(url)}
                            />
                        </div>
                        <div
                            style={{
                                margin: 1,
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Button
                                sx={{ mt: 1, mb: 1 }}
                                variant="contained"
                                type="submit"
                            >
                                Create
                            </Button>
                            <Button
                                sx={{ mt: 1, mb: 1 }}
                                variant="outlined"
                                type="reset"
                                onClick={resetField}
                            >
                                Reset
                            </Button>
                        </div>
                    </Box>
                </form>
            </Card>
        </div>
    )
}

export default BlogForm
