import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: null,
  },
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload; 
    },
    clearChat: (state) => {
      state.chats = null;
    },
  },
});

export const { setChats, clearChat } = chatSlice.actions;

export default chatSlice.reducer;
