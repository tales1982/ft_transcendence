import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import tasksReducer from "./slices/tasks.slice";
import chatReducer from "./slices/chat.slice";
import notificationsReducer from "./slices/notifications.slice";
import paymentReducer from "./slices/payment.slice";
import languageReducer from "./slices/LanguagesSlices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    chat: chatReducer,
    notifications: notificationsReducer,
    payment: paymentReducer,
    language: languageReducer,
  },
  middleware: (g) => g({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
