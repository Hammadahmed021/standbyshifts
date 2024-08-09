import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";
import "./i18n";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter, RouterProvider } from "react-router-dom";
// import router from "./router/router";
import BaseRouter from "./router/router.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BaseRouter />
      </PersistGate>
    </Provider>
  </>
);
