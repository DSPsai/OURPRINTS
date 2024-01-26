import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import PrivateRoute from './components/PrivateRoute';
import Page404 from './pages/Page404';
import Page500 from './pages/Page500';
import Welcome from './pages/Welcome';
import Redirect from './pages/Redirect';
import DefaultLayout from './layouts/DefaultLayout';
import Login from './pages/Login';
import './App.css';
import theme from './styles/theme';
import rootReducer from './rootReducer';
import OrderPrint from 'views/Orders/OrderPrint';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const store = configureStore({
  reducer: rootReducer,
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          autoHideDuration={3000}
          maxSnack={3}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}>
          <RenderRouter />
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}

function RenderRouter() {

  return (
    <Router>
      <Switch>
        <Route
          exact
          path='/404'
          render={props => <Page404 {...props} />}
        />
        <Route
          exact
          path='/500'
          render={props => <Page500 {...props} />}
        />
        <Route
          exact
          path='/login'
          render={props => <Login {...props} />}
        />
        <Route exact path='/welcome'>
          <Welcome />
        </Route>
        <Route path='/redirect'>
          <Redirect />
        </Route>
        <PrivateRoute path={`/print/:id`}
          render={props => <OrderPrint />}
        />

        <PrivateRoute
          path='/'
          render={props => <DefaultLayout {...props} />}
        />
      </Switch>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
