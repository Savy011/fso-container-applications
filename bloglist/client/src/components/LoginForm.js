import NotifBox from './NotifBox'
import { useField, removeReset } from '../utils/hooks'
import { useNotification } from '../utils/NotifContext'
import loginService from '../services/login'
import { setToken } from '../utils/requests'
import { useUserDispatch } from '../utils/UserContext'
import { Card, TextField, Typography, Box, Button } from '@mui/material'

const LoginForm = () => {
    const username = useField('text')
    const password = useField('password')
    const setNotif = useNotification()
    const dispatch = useUserDispatch()

    const handleLogin = async event => {
        event.preventDefault()

        try {
            const loggedUser = await loginService.login({
                username: username.value,
                password: password.value,
            })
            window.localStorage.setItem(
                'loggedBlogAppUser',
                JSON.stringify(loggedUser)
            )
            dispatch({ type: 'SET_USER', payload: loggedUser })
            setToken(loggedUser.token)
            username.reset()
            password.reset()
        } catch (err) {
            setNotif('Wrong Credentials', 5000)

            console.error(err)
        }
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
                    Log-in to the Application
                </Typography>
                <NotifBox />
                <form onSubmit={handleLogin}>
                    <Box sx={{ m: 2 }}>
                        <TextField
                            sx={{ mt: 1, mb: 1 }}
                            fullWidth
                            label="Username"
                            {...removeReset(username)}
                        />
                        <TextField
                            sx={{ mt: 1, mb: 1 }}
                            fullWidth
                            label="Password"
                            {...removeReset(password)}
                        />
                        <Button
                            sx={{ mt: 1, mb: 1 }}
                            variant="contained"
                            type="submit"
                        >
                            Log In
                        </Button>
                    </Box>
                </form>
            </Card>
        </div>
    )
}

export default LoginForm
