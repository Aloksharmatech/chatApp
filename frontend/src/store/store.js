import { configureStore } from '@reduxjs/toolkit'
import  authReducer from '../store/auth/auth-slice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
})