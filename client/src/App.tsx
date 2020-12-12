import React, { Component, ReactElement, Fragment } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

import Login from './pages/Login';
import Home from './pages/Home';

import './App.css';

/**
 * Interfaces
 */
interface State {
    isLogin: boolean,
    statusMessage: string
}

/**
 * Component
 */
export default class App extends Component {
    constructor(props: {}) {
        super(props);
        
        this.state = {isLogin: false, statusMessage: "Not authenticated"};

        this.setAppState = this.setAppState.bind(this);
    }

    public readonly state: State = {
        isLogin: false,
        statusMessage: ""
    }

    // Update app state from login component
    setAppState(isLogin: boolean, statusMessage: string): void {
        this.setState({isLogin: isLogin, statusMessage: statusMessage});
    }

    render(): ReactElement {
        return <Fragment>
            <Router>
                <Switch>
                    <Route path="/success">
                        <Home isLogin={this.state.isLogin} statusMessage={this.state.statusMessage} />
                    </Route>
                    <Route path="/">
                        <Login setAppState={this.setAppState} />
                    </Route>
                </Switch>
            </Router>
        </Fragment>
    }
}