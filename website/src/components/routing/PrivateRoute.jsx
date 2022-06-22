import React from "react";
import {Redirect, Route} from "react-router-dom";
import Frame from "../Frame/Frame";

const PrivateRoute = ({
  component,
  ...rest
}) => {

  const isLoggedIn = () => localStorage.getItem('cloud-token') !== undefined &&
                           localStorage.getItem('cloud-token') !== null;

  return (
    <Route
      {...rest}
      render={() => isLoggedIn() ?
        <Frame>{component}</Frame> :
        <Redirect to={'/login'}/>
      }
    />
  );
}

export default PrivateRoute;