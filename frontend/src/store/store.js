import { configureStore } from '@reduxjs/toolkit'
import  authReducer from '../store/auth/auth-slice'
import chatReducer from "../store/chatselected/chat-slice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        account:chatReducer
    },
})