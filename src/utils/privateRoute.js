import React from 'react';
import { Route, Redirect } from 'react-router-dom';

/**
 * Route that redirects to the login page if no user is authenticated.
 */
export default class PrivateRoute extends React.Component {

  render() {
    const {
      component: Component,
      render,
      isAuthenticated,
      ...rest
    } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            Component ? (
              <Component {...props} />
            ) : (
              render(props)
            )
          ) : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
}
