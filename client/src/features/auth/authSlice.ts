import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AuthState,
  SetCredentialsPayload,
  UpdateCredentialsPayload,
} from "@/types";

const initialState: AuthState = {
  accessToken: null,
  expiresAt: null,
  user: null,
  reportSetting: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.accessToken = action.payload.accessToken;
      state.expiresAt = action.payload.expiresAt;
      state.user = action.payload.user;
      state.reportSetting = action.payload.reportSetting;
    },
    updateCredentials: (state, action: PayloadAction<UpdateCredentialsPayload>) => {
      const { accessToken, expiresAt, user, reportSetting } = action.payload;

      if (accessToken !== undefined) state.accessToken = accessToken;
      if (expiresAt !== undefined) state.expiresAt = expiresAt;
      if (user !== undefined && state.user && user) {
        state.user = { ...state.user, ...user };
      }
      if (reportSetting !== undefined && reportSetting !== null && state.reportSetting) {
        state.reportSetting = { ...state.reportSetting, ...reportSetting };
      } else if (reportSetting !== undefined) {
        state.reportSetting = reportSetting as typeof state.reportSetting;
      }
    },
    logout: (state) => {
      state.accessToken = null;
      state.expiresAt = null;
      state.user = null;
      state.reportSetting = null;
    },
  },
});

export const { setCredentials, updateCredentials, logout } = authSlice.actions;
export default authSlice.reducer;