import React from "react";
import { Route, Switch } from "react-router-dom"; 

import Home from "./containers/Home";
import Login from "./containers/Login"; 
import Signup from "./containers/Signup";
import NotFound from "./containers/NotFound";

export default function Routes() { 
    return (
        <Switch>
            <Route exact path="/">
                <Home /> 
            </Route>
            <Route exact path="/login"> 
                <Login />
            </Route>
            <Route exact path="/signup"> 
                <Signup />
            </Route>
            <Route>
                <NotFound /> 
            </Route>
        </Switch>
    );
}