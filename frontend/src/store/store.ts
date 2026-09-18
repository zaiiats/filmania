import {
  configureStore,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

interface UserInterface {
  username: string | null;
  email: string | null;
  profilePicture: string | null;
  id: string | null;
}

const defaultUser: UserInterface = {
  username: null,
  email: null,
  profilePicture: null,
  id: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: defaultUser,
  reducers: {
    login(state, action: PayloadAction<UserInterface>) {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.profilePicture = action.payload.profilePicture;
      state.id = action.payload.id;
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

export const useTypedSelector = useSelector.withTypes<StoreState>();
export const useTypedDispatch = useDispatch.withTypes<DispatchState>();
