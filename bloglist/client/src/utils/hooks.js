import { useState } from 'react'

export const useField = type => {
    const [value, setValue] = useState('')

    const onChange = event => {
        setValue(event.target.value)
    }

    const reset = () => {
        setValue('')
    }

    return {
        type,
        value,
        onChange,
        reset,
    }
}

export const removeReset = obj => {
    // eslint-disable-next-line no-unused-vars
    const { reset, ...retObj } = obj

    return retObj
}
