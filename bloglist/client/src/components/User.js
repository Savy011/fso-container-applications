import {
    Card,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import { Notes as NotesIcon } from '@mui/icons-material'
import { useLocation } from 'react-router-dom'

const User = () => {
    const location = useLocation()
    const user = location.state
    return (
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
                {user.name}
            </Typography>
            <Box sx={{ p: 2 }}>
                <Typography
                    variant="h6"
                    sx={{
                        display: 'flex',
                        justifyContent: 'left',
                        m: 1,
                        fontFamily: 'Spline Sans',
                    }}
                >
                    <h4>Added Blogs:</h4>
                </Typography>
                <List>
                    {user.blogs.map(blog => (
                        <ListItem
                            key={blog.id}
                            disablePadding
                        >
                            <ListItemIcon>
                                <NotesIcon />
                            </ListItemIcon>
                            <ListItemText primary={blog.title} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Card>
    )
}

export default User
