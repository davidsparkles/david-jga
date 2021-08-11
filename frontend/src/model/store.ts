import { configureStore } from "@reduxjs/toolkit"
import permissionReducer from "./permissionReducer";
// import rewardsReducer from "./rewardsReducer";
// import questsReducer from "./questsReducer";

const store = configureStore({
  reducer: {
    // quests: permissionReducer,
    // rewards: rewardsReducer,
    permission: permissionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
