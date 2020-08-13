import React, {Fragment} from "react";
import {Link, withRouter} from "react-router-dom";
import { isAuth, signout } from "../utils/helpers";

const Layout =({match, history,children}) =>{
  const isMatch =(path) => {
    if(match.path === path){
      return {color:"#000"}
    }
    else{
      return{color:"#fff"}
    }
  };

  const nav =() =>(
    <ul className="nav nav-tabs bg-primary">
    <li className="nav-item">
      <Link to="/" className="nav-link" style={isMatch("/")}>Home</Link>
    </li>
      {!isAuth() && (
        <>
          <li className="nav-item">
            <Link to="/signin" className="nav-link" style={isMatch("/signin")}>Sign in</Link>
          </li>
          <li className="nav-item">
            <Link to="/signup" className="nav-link" style={isMatch("/signup")}>Sign up</Link>
          </li>
        </>
      )}

      {isAuth() && (
        <>
          <li className="nav-item">
            <Link to="/dashboard" className="nav-link" style={isMatch("/dashboard")}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <span
            className="nav-link"
            style={{ cursor: "pointer", color: "#fff" }}
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}>
              Signout
              </span>
          </li>
        </>
      )}

    </ul>
  );

return(
  <Fragment>
    {nav()}
    <div>{children}</div>
  </Fragment>
);
};


export default withRouter(Layout);
