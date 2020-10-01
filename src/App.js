import React from "react";
import {HashRouter, Switch, Route, Redirect} from "react-router-dom";
import MultiStepForm from "./components/MultiStepForm";
import Header from "./components/Header";

function App() {
    return (
        <React.Fragment>
            <HashRouter>
                <Header/>
                <Switch>
                    <Route path="/" exact render={() => <Redirect to="/start"/>}/>
                    <Route path="/start" component={MultiStepForm}/>
                </Switch>
            </HashRouter>
        </React.Fragment>
    );
}

export default App;
