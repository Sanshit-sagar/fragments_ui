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
import { Button } from "react-bootstrap"; 

import ErrorBoundary from "./components/ErrorBoundary"; 
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline"; 

export default function App() { 
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);

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
      <ScopedCssBaseline> 
      <div className="App container py-3">
        <Navbar collapseOnSelect bg="light" variant="light" expand="md" className="mb-3">
          <LinkContainer to="/dashboard">
            <Navbar.Brand>
              <div className="Logo"> 
              / frag / ments / 
              </div>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  {/* <LinkContainer to="/dashboard">
                    <Nav.Link>
                      <Button variant="light"> 
                        Dashboard
                      </Button> 
                    </Nav.Link>
                  </LinkContainer> */}

                   <LinkContainer to="/">
                    <Nav.Link>
                      <Button variant="light"> 
                        Cache
                      </Button> 
                    </Nav.Link>
                  </LinkContainer>

                  {/* <LinkContainer to="/themes">
                    <Nav.Link>
                      <Button variant="light"> 
                        Themes
                      </Button> 
                    </Nav.Link>
                  </LinkContainer> */}

                  <LinkContainer to="/settings">
                    <Nav.Link> 
                      <Button variant="light"> 
                        Profile    
                      </Button>
                    </Nav.Link>
                  </LinkContainer>

                  <div className="Logout"> 
                    <Nav.Link onClick={handleLogout}>
                      <Button variant="dark"> 
                        Logout
                      </Button> 
                    </Nav.Link>
                  </div>
                </>
              ) : (
                <>
                  <LinkContainer to="/signup">
                    <Nav.Link>
                      <Button variant="light"> 
                        SignUp
                      </Button> 
                    </Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/login">
                    <Nav.Link>
                      <Button variant="light"> 
                        Login
                      </Button> 
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <ErrorBoundary>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
            <Routes />
          </AppContext.Provider>
        </ErrorBoundary>
      </div>
      </ScopedCssBaseline> 
    )
  );
}
