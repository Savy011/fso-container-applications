import { Alert } from '@mui/material'
import { useNotifValue } from '../utils/NotifContext'

const NotifBox = () => {
    const notif = useNotifValue()

    /*const style = {
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        border: 'solid',
        borderRadius: 10,
        fontFamily: 'monospace',
        fontSize: 18,
    }*/

    if (notif.message === '') {
        return null
    }

    return <Alert severity={notif.severity}>{notif.message}</Alert>
}

export default NotifBox
