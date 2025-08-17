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
      state.selectedChat = null;
    },
  },
});

export const { setChats, clearSelectedChat } = chatSlice.actions;

export default chatSlice.reducer;
