import { createSlice } from "@reduxjs/toolkit";

const onlineSlice = createSlice({
  name: "online",
  initialState: {
    users: {},     // online users
    lastSeen: {},  // offline users last seen time
  },
  reducers: {
    setOnlineUsers: (state, action) => {
      state.users = action.payload.users;
      state.lastSeen = action.payload.lastSeen;
    },
  },
});

export const { setOnlineUsers } = onlineSlice.actions;
export default onlineSlice.reducer;
