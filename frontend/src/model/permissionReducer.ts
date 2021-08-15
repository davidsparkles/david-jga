import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { RootState } from "./store";

export type Permission = "none" | "view" | "edit";

interface PermissionState {
  token: string;
  permission: Permission
}

// Define the initial state using that type
const initialState: PermissionState = {
  token: "",
  permission: "none"
}

const EDIT_TOKEN = "broiler";
const VIEW_TOKEN = "fittie";

export const permissionSlice = createSlice({
  name: "permission",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;

      if (Cookies.get("token") !== token) {
        Cookies.set("token", token, { sameSite: "lax", expires: 30 });
      }

      switch (token) {
        case EDIT_TOKEN:
          state.permission = "edit";
          break;
        case VIEW_TOKEN:
          state.permission = "view";
          break;
        default:
          state.permission = "none";
          break;
      }
    }
  }
})

export const { changeToken } = permissionSlice.actions;

export const selectToken = (state: RootState) => state.permission.token;
export const selectPermission = (state: RootState) => state.permission.permission;

export default permissionSlice.reducer;
