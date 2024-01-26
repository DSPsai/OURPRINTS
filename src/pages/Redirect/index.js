import React from 'react';
import { Switch, Route, BrowserRouter, useRouteMatch } from 'react-router-dom';

import Logout from './Logout';

export default function () {

  const match = useRouteMatch('/redirect');

  return (
    <BrowserRouter>
      <Switch>
        <Route path={`${match.url}/logout`}>
          <Logout />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}