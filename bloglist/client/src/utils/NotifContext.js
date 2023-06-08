import { useReducer, createContext, useContext } from 'react'

const initialState = {
    message: '',
    severity: 'info',
}

const notifReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return {
                message: action.payload.message,
                severity: action.payload.severity,
            }
        case 'CLEAR':
            return initialState
        default:
            return state
    }
}

const NotifContext = createContext()

export const NotifContextProvider = props => {
    const [notif, notifDispatch] = useReducer(notifReducer, initialState)

    return (
        <NotifContext.Provider value={[notif, notifDispatch]}>
            {props.children}
        </NotifContext.Provider>
    )
}

export const useNotifValue = () => {
    const notifAndDispatch = useContext(NotifContext)

    return notifAndDispatch[0]
}

export const useNotifDispatch = () => {
    const notifAndDispatch = useContext(NotifContext)

    return notifAndDispatch[1]
}

export const useNotification = () => {
    // eslint-disable-next-line no-unused-vars
    const [notif, notifDispatch] = useContext(NotifContext)

    const setNotif = (message, severity, time) => {
        notifDispatch({ type: 'SET', payload: { message, severity } })
        setTimeout(() => {
            notifDispatch({ type: 'CLEAR' })
        }, time)
    }

    return setNotif
}

export default NotifContext
