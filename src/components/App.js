import React, { Component } from 'react';
import 'fontsource-roboto';


import Drawer from './Drawer'
import Login from './Login'

import {
  Switch,
  Route,
  useHistory,
  Redirect,
} from "react-router-dom";




export default class App extends Component {

  render() {
    var loggedIn = localStorage.getItem('userID')
    return (

      <div>
        <Route to="/drawer">
          {loggedIn ? <Drawer /> : <Redirect to="/login"/>}
        </Route>

        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/drawer" component={Drawer} />
        </Switch> 

      </div>
    );
  }
}
