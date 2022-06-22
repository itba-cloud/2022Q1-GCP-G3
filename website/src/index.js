import React from 'react';
import ReactDOM, {createRoot} from 'react-dom/client';
import './index.css';
import Frame from "./components/Frame/Frame";
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import App from './App';
import Subjects from "./components/Subjects/Subjects";
import PrivateRoute from "./components/routing/PrivateRoute";
import Register from "./components/Register/Register";
import NotFound from "./components/NotFound/NotFound";
import Login from "./components/Login/Login";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path={'/'} component={<Subjects/>}/>
        <Route exact path={'/login'} component={Login}/>
        <Route exact path={'/register'} component={Register}/>
        <Route component={NotFound}/>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>
);
