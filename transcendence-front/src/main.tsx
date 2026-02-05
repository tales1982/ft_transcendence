import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n/i18n";

import { Provider } from "react-redux";
import { store } from "./store/store";

import { RouterProvider } from "@tanstack/react-router";
import { router } from "./router";

import { AppProviders } from "./app/providers/AppProviders";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </Provider>
  </React.StrictMode>
);
