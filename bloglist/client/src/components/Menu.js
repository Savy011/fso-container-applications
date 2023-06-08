import { Link } from 'react-router-dom'
import UserContext from '../utils/UserContext'
import { useContext, useState } from 'react'
import {
    AppBar,
    Avatar,
    Button,
    Grid,
    IconButton,
    ListItemIcon,
    Menu,
    MenuItem,
    Toolbar,
    useMediaQuery,
    Typography,
    Box,
} from '@mui/material'
import {
    Person as PersonIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
} from '@mui/icons-material'

const TopMenu = () => {
    const [user, dispatch] = useContext(UserContext)
    const isSmallScreen = useMediaQuery('(max-width: 600px)')
    const [avatarAnchorEl, setAvatarAnchorEl] = useState(null)
    const [hamburgerAnchorEl, setHanburgerAnchorEl] = useState(null)

    const handleAvatarClick = event => {
        setAvatarAnchorEl(event.currentTarget)
    }

    const handleAvatarMenuClose = () => {
        setAvatarAnchorEl(null)
    }
    const handleHamburgerClick = event => {
        setHanburgerAnchorEl(event.currentTarget)
    }

    const handleHanburgerMenuClose = () => {
        setHanburgerAnchorEl(null)
    }
    const handleLogout = event => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogAppUser')
        dispatch({ type: 'CLEAR_USER' })
    }
    function stringToColor(string) {
        let hash = 0
        let i

        /* eslint-disable no-bitwise */
        for (i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash)
        }

        let color = '#'

        for (i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff
            color += `00${value.toString(16)}`.slice(-2)
        }
        /* eslint-enable no-bitwise */

        return color
    }
    function stringAvatar(name) {
        return {
            sx: {
                bgcolor: stringToColor(name),
            },
            children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
        }
    }

    return (
        <AppBar
            position="fixed"
            sx={{ mb: 3 }}
        >
            <Toolbar>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    {isSmallScreen ? (
                        <>
                            <Grid item>
                                <IconButton
                                    color="inherit"
                                    onClick={handleHamburgerClick}
                                >
                                    <MenuIcon />
                                </IconButton>
                            </Grid>
                            <Menu
                                anchorEl={hamburgerAnchorEl}
                                open={Boolean(hamburgerAnchorEl)}
                                onClose={handleHanburgerMenuClose}
                            >
                                <MenuItem
                                    onClick={handleHanburgerMenuClose}
                                    component={Link}
                                    to="/"
                                >
                                    Home
                                </MenuItem>
                                <MenuItem
                                    onClick={handleHanburgerMenuClose}
                                    component={Link}
                                    to="/users"
                                >
                                    Users
                                </MenuItem>
                                <MenuItem
                                    onClick={handleHanburgerMenuClose}
                                    component={Link}
                                    to="/create"
                                >
                                    Create New
                                </MenuItem>
                            </Menu>
                            <Typography variant="h4">Blogs</Typography>
                        </>
                    ) : (
                        <>
                            <h2>Blogs</h2>
                            <Box sx={{ display: 'flex' }}>
                                <Grid item>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/"
                                    >
                                        Home
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/users"
                                    >
                                        Users
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        color="inherit"
                                        component={Link}
                                        to="/create"
                                    >
                                        Create New
                                    </Button>
                                </Grid>
                            </Box>
                        </>
                    )}
                    <Grid item>
                        <IconButton
                            color="inherit"
                            onClick={handleAvatarClick}
                        >
                            <Avatar {...stringAvatar(`${user.name}`)} />
                        </IconButton>
                        <Menu
                            anchorEl={avatarAnchorEl}
                            open={Boolean(avatarAnchorEl)}
                            onClose={handleAvatarMenuClose}
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                {user.name}
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                Log-Out
                            </MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}

export default TopMenu
