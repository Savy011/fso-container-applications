import { useQuery } from 'react-query'
import { getAllUsers } from '../utils/requests'
import Loading from './Loading'
import Error from './Error'
import { Link } from 'react-router-dom'
import {
    Typography,
    Box,
    Card,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@mui/material'

const Users = () => {
    const result = useQuery('users', getAllUsers)
    const users = result.data

    const UserTable = () => {
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
                    variant="h3"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        m: 1,
                        fontFamily: 'Spline Sans',
                    }}
                >
                    Users
                </Typography>
                <Box sx={{ m: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">
                                    Blogs Created
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell align="center">
                                        <Link
                                            to={`/users/${user.id}`}
                                            state={user}
                                        >
                                            {user.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell align="center">
                                        {user.blogs.length}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Card>
        )
    }

    return (
        <div>
            {result.isLoading ? (
                <Loading />
            ) : result.isError ? (
                <Error />
            ) : (
                <UserTable />
            )}
        </div>
    )
}

export default Users
