import React from 'react';
import { Switch, Route, withRouter, useRouteMatch } from 'react-router-dom';
import SubAdminslist from './StaffUserLIst';
import AddSubAdmin from './AddStaffUser';
import EditSubAdmin from './EditStaffUser';
import StaffUserView from 'views/StaffUser/StaffUserView';

function StaffUsers() {
  const match = useRouteMatch('/staff_users');
  return (
    <React.Suspense fallback={<h1>Loading</h1>}>
      <Switch>
      <Route path={`${match.url}/:id/view`}>
        <StaffUserView />
      </Route>
        <Route path={`${match.url}/add`}>
          <AddSubAdmin />
        </Route>
        <Route path={`${match.url}/:id`}>
          <EditSubAdmin />
        </Route>
        <Route path={`${match.url}`}>
          <SubAdminslist />
        </Route>
      </Switch>
    </React.Suspense>
  );
}

export default withRouter(StaffUsers);
