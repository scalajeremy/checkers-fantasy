import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Homepage from './homepage';
import Mainboard from './mainboard';

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Homepage} />
    <Route exact path="/play" component={Mainboard} />
  </Switch>
)

export default Routes
