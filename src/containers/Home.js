import React, { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import { API } from "aws-amplify"; 
import "./Home.css";
import { BsPencilSquare } from "react-icons/bs"; 
import { LinkContainer } from "react-router-bootstrap"; 
import { Link } from "react-router-dom"; 
import { Chip } from "@material-ui/core"; 


export default function Home() {
  const [notes, setNotes] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }
  
      try {
        const notesLoaded = await loadNotes();
        setNotes(notesLoaded);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [isAuthenticated]);
  
  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderNotesList() {
    return (
      <div className="HomePage" style={{ height: "100vh" }}>
      
      
        <LinkContainer to="/notes/new">
          <ListGroup.Item action variant="dark" className="py-3 text-truncate">
            <BsPencilSquare size={17} />
            <span > New Snippet </span>
          </ListGroup.Item>
        </LinkContainer>

        <br /> 

      
        {notes.map(({ noteId, content, createdAt }) => (
          <LinkContainer key={noteId} to={`/notes/${noteId}`} >
            
            <ListGroup.Item action variant="info" horizontal>
             
                  
              <div style={{ display: "flex", flexDirection: "row" }}>
                <span className="font-weight-bold" style = {{ marginRight: "5px" }}>
                  {content.trim().split("\n")[0].substring(0,21)}
                </span>
                {/* <Chip label = "moniker" style = {{ margin: "2px" }} />  */}
                <br />

              <div className="tagsAndTimestamp" style={{ display: "flex", marginLeft:"auto" }}> 
               
                <Chip label = "tag1" style = {{ marginRight: "10px" }} /> 
                <br />
                <Chip label = "tag2" style = {{ marginRight: "10px" }} /> 
                <br />
                <span className="text-muted">
                  {new Date(createdAt).toLocaleString()} 
                </span>
              </div>

              <br /> 
            </div> 

            </ListGroup.Item>
            
          </LinkContainer>
        ))}
      </div>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>/ frag / ments / </h1>
        <p className="text-muted">Bring Your Code Snippets To Life</p>
      
        <div className="pt-3"> 
          <Link to="/login" className="btn btn-light btn-lg mr-3"> 
            Login 
          </Link>
          <Link to="/signup" className="btn btn-dark btn-lg"> 
            Signup
          </Link>
        </div>      
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="notes">
        {/* <h2 className="pb-3 mt-4 mb-3 border-bottom">Cached Snippets</h2> */}
        <ListGroup>{!isLoading && renderNotesList()}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}