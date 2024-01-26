import React from 'react';
import { Switch, Route,Redirect } from 'react-router-dom';
import StaffUserDashboard from 'views/StaffUserDashboard';
import PendingOrders from 'views/StaffUserOrders/PendingOrders';
import CompletedOrders from 'views/StaffUserOrders/CompletedOrders';
import UpadatePassword from 'views/UpdatePassword/UpadatePassword';
import OrderPage from 'views/Orders/OrderPage';
import OutForDelivery from 'views/StaffUserOrders/OutForDelivery'
function Routes() {
  return (
    <Switch>
        <Route path='/update_password'>
        <UpadatePassword />
      </Route>
      <Route path='/completed_orders'>
        <CompletedOrders />
      </Route>
      <Route path='/assigned_orders'>
        <PendingOrders />
      </Route>
      <Route path='/out_for_delivery_orders'>
        <OutForDelivery />
      </Route>
      <Route path='/order/:id'>
        <OrderPage />
      </Route>
      <Route path='/dashboard'>
        <StaffUserDashboard />
      </Route>
      <Route exact path="/" render={() => (
          <Redirect to={{
            pathname: "/dashboard"
          }} />
        )}>
        </Route>
    </Switch>
  );
}

export default Routes;
