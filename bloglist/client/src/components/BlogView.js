import { useNavigate, useParams } from 'react-router-dom'
import { useUserValue } from '../utils/UserContext'
import { useNotification } from '../utils/NotifContext'
import { postComment, putBlog, removeBlog } from '../utils/requests'
import { useField, removeReset } from '../utils/hooks'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import Loading from './Loading'
import Error from './Error'
import {
    Card,
    Typography,
    Button,
    Grid,
    TextField,
    List,
    ListItem,
    ListItemText,
} from '@mui/material'
import {
    ThumbUpRounded as LikeIcon,
    Delete as DeleteIcon,
    AddComment as AddCommentIcon,
    Create as CreateIcon,
    ShortText as ListIcon,
} from '@mui/icons-material'

const BlogView = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const result = useQuery('blogs')
    const blogs = result.data

    const blog = blogs !== undefined ? blogs.find(b => b.id === id) : null
    const user = useUserValue()
    const setNotif = useNotification()
    const comment = useField('text')
    const queryClient = useQueryClient()

    const updateBlogMutation = useMutation(putBlog, {
        onSuccess: () => {
            queryClient.invalidateQueries('blogs')
        },
    })

    // eslint-disable-next-line no-unused-vars
    const deleteBlogMutation = useMutation(removeBlog, {
        onSuccess: () => {
            queryClient.invalidateQueries('blogs')
        },
    })

    const addCommentMutuation = useMutation(postComment, {
        onSuccess: () => {
            queryClient.invalidateQueries('blogs')
        },
    })

    const updateBlog = async blogObj => {
        try {
            updateBlogMutation.mutateAsync(blogObj)
            setNotif(
                `Liked '${blogObj.title}' by ${blogObj.author}`,
                'success',
                5000
            )
        } catch (err) {
            setNotif(
                `Error occured while updating '${blogObj.title}'`,
                'error',
                5000
            )
            console.error(err)
        }
    }

    const deleteBlog = async blogObj => {
        try {
            const confirmation = window.confirm(`Delete ${blogObj.title}?`)
            console.log('Confirmation', confirmation)
            if (confirmation) {
                deleteBlogMutation.mutateAsync(blogObj)
                navigate('/')
                setNotif(
                    `Deleted '${blogObj.title}' by ${blogObj.author}`,
                    'error',
                    5000
                )
            } else {
                setNotif('Deletion Cancelled', 'info', 5000)
            }
        } catch (err) {
            setNotif(
                `Error occured while Deleting '${blogObj.title}'`,
                'error',
                5000
            )
            console.log(err)
        }
    }
    // eslint-disable-next-line no-unused-vars
    const likeBlog = () => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1,
        }

        updateBlog(updatedBlog)
    }

    const delBlog = () => {
        deleteBlog(blog)
    }

    const addComment = () => {
        const commentObj = {
            id: blog.id,
            comment: comment.value,
        }

        addCommentMutuation.mutateAsync(commentObj)
        console.log(commentObj)
        comment.reset()
    }

    if (result.isLoading) return <Loading />

    if (result.isError) return <Error />

    return (
        <Card
            sx={{
                mt: 2,
                p: 2,
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
                {blog.title}
            </Typography>
            <Typography>
                <b>Author:</b> {blog.author}
            </Typography>
            <Typography>
                <b>Link:</b> <a href={blog.url}>{blog.url}</a>
            </Typography>
            <Grid
                container
                alignItems="center"
            >
                <Grid item>
                    <Typography>Has {blog.likes} Likes &nbsp;</Typography>
                </Grid>
                <Grid item>
                    <Button onClick={likeBlog}>
                        <LikeIcon />
                    </Button>
                </Grid>
            </Grid>
            <Typography>Added by {blog.user.name}</Typography>
            {user.username === blog.user.username ? (
                <Button
                    onClick={delBlog}
                    startIcon={<DeleteIcon />}
                >
                    Delete
                </Button>
            ) : null}
            <Typography variant="h5">Comments:</Typography>
            <TextField
                variant="standard"
                {...removeReset(comment)}
            />
            &nbsp;
            <Button
                onClick={addComment}
                startIcon={<AddCommentIcon />}
            >
                Add Comment
            </Button>
            <List>
                {blog.comments.length !== 0 ? (
                    blog.comments.map(comment => (
                        <ListItem
                            key={comment}
                            disablePadding
                        >
                            <ListIcon fontSize="small" />
                            <ListItemText primary={comment} />
                        </ListItem>
                    ))
                ) : (
                    <Typography
                        variant="subtitle"
                        fontSize="14"
                    >
                        <CreateIcon fontSize="small" /> Be the first to comment!
                    </Typography>
                )}
            </List>
        </Card>
    )
}

export default BlogView
