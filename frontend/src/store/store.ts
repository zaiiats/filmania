import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

interface UserInterface {
  username: string | null;
  email: string | null;
  userData: null;
}

const defaultUser: UserInterface = {
  username: null,
  email: null,
  userData: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: defaultUser,
  reducers: {
    login(state, action: PayloadAction<UserInterface>) {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.userData = action.payload.userData;
    },
    logout() {
      return { ...defaultUser };
    },
  },
});

export const { login, logout } = userSlice.actions;
const userReducer = userSlice.reducer;

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

type StoreState = ReturnType<typeof store.getState>;
type DispatchState = typeof store.dispatch;

export const UseTypedSelector = useSelector.withTypes<StoreState>();
export const UseTypedDispatch = useDispatch.withTypes<DispatchState>();
