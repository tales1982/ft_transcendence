import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import languageReducer from "./slices/LanguagesSlices";

export const store = configureStore({
  reducer:{ 
    auth: authReducer,
    language: languageReducer},
  middleware: (g) => g({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
