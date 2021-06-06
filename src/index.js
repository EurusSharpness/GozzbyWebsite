import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import {App} from "./components/App";
import {SignUp, SignIn, ResetPassword} from "./components/LoginPage";
import {BrowserRouter, Route} from "react-router-dom";

ReactDOM.render(
    <BrowserRouter>
        <div>
            <Route exact path="/" component={SignIn}/>
            <Route path="/signup" component={SignUp}/>
            <Route path="/reset_password" component={ResetPassword}/>
            <Route path="/app" component={App}/>
        </div>
    </BrowserRouter>,
    document.getElementById("root")
);

serviceWorker.unregister();
