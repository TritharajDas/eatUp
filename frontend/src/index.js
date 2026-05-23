import React from "react";
import "./index.css"

import { BrowserRouter as Router } from "react-router-dom";

import App from "./App"
import { StateProvider } from "./context/StateProvider";
import { initialState } from "./context/initialState";
import reducer from "./context/reducer";

import { createRoot } from 'react-dom/client';
const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
    <Router>
        <StateProvider initialState={initialState} reducer={reducer} >
            <App />
        </StateProvider>
    </Router>
);
