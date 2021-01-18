import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar"; 
import Nav from "react-bootstrap/Nav"; 

import "./App.css";
import config from "./config"; 
import Routes from "./Routes"; 

import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";

function App() { 
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  async function componentDidMount() {
    this.loadFacebookSDK();

    try {
      await Auth.currentAuthenticatedUser();
      this.userHasAuthenticated(true);
    } catch (e) {
      if (e !== "not authenticated") {
        alert(e);
      }
    }

    this.setState({ isAuthenticating: false });
  }

  function loadFacebookSDK() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId            : config.social.FB,
        autoLogAppEvents : true,
        xfbml            : true,
        version          : 'v9.0'
      });
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }

  async function handleLogout() {
    await Auth.signOut();
  
    userHasAuthenticated(false);
  }

  useEffect(() => { 
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true); }
    catch(e) {
      if (e !== 'No current user') {
        onError(e); 
      }
    }
    setIsAuthenticating(false); 
  }

  return (
    !isAuthenticating && (
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" variant="light" expand="md" className="mb-3">
          <LinkContainer to="/">
            <Navbar.Brand>
              / frag / ments / 
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <LinkContainer to="/settings">
                    <Nav.Link>Settings</Nav.Link>
                  </LinkContainer>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>Signup</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>Login</Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
          <Routes />
        </AppContext.Provider>
      </div>
    )
  );
}

export default App;