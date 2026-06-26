import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";

// 1. Wrap the store configuration inside a function
export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
    },
  });
};

// 2. Export inferenced types for your TypeScript hooks
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
