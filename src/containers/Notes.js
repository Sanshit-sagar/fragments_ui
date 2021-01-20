import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import Form from "react-bootstrap/Form"; 
import LoaderButton from "../components/LoaderButton"; 
import config from "../config"; 
import "./Notes.css"; 
import { s3Upload } from "../libs/awsLib"; 
import { Card, Button } from "react-bootstrap"; 

import SyntaxHighlighter from 'react-syntax-highlighter';
import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState("");
  const [openEditor, setOpenEditor] = useState(false); 
  const [programmingLanguage, setProgrammingLanguage] = useState("javascript")
  const [isLoading, setIsLoading] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false); 

  useEffect(() => {
    function loadNote() {
      return API.get("notes", `/notes/${id}`);
    }

    async function onLoad() {
      try {
        const note = await loadNote();
        const { content, attachment } = note;

        if (attachment) {
          note.attachmentURL = await Storage.vault.get(attachment);
        }

        setContent(content);
        setNote(note);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  function validateForm() {
    return content.length > 0;
  }
  
  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }
  
  function handleFileChange(event) {
    file.current = event.target.files[0];
  }
  
  function saveNote(note) {
    return API.put("notes", `/notes/${id}`, {
      body: note
    });
  }
  
  async function handleSubmit(event) {
    let attachment;
  
    event.preventDefault();
  
    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }
  
    setIsLoading(true);
  
    try {
      if (file.current) {
        attachment = await s3Upload(file.current);
      }
  
      await saveNote({
        content,
        attachment: attachment || note.attachment
      });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }

  function Codeblock() {
    return (
      <SyntaxHighlighter language={programmingLanguage} style={shadesOfPurple}> 
        { content }
      </SyntaxHighlighter>
    );
  }; 
  
  async function handleDelete(event) {
    event.preventDefault();
  
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
  
    if (!confirmed) {
      return;
    }
  
    setIsDeleting(true);
  
    try {
      await deleteNote();
      history.push("/");
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  }

  function handleEdit(event) {
    event.preventDefault(); 

    setOpenEditor(!openEditor); 
  }

  const LanguageSelector = () => {
    return (
      <Form.Group controlId="LanguageSelector">
        <Form.Label>Language</Form.Label>
        <Form.Control as="select">
          <option>Java</option>
          <option>C++</option>
          <option>JavaScript</option>
          <option>Python</option>
        </Form.Control>
      </Form.Group> 
    ); 
  }
  
  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>

         <div className="Editor">
           <div className = "editorPane"> 
            {openEditor && <Form.Group controlId="content">
              <Form.Control
                as="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group> }
            
            {!openEditor && <Codeblock />} 
            <Button
              block
              size="sm"
              variant="outline-success"
              isLoading={isLoading}
              onClick={handleEdit}
            >
              {!openEditor && 'Edit'}
              {openEditor && 'Done'}
            </Button>
            </div> 

            <div className="sidePane"> 
              <Card>
                <Card.Header as="h5">Settings</Card.Header>
                <Card.Body>
                  <Card.Title>Attachments</Card.Title>
              
                
                  <Form.Group controlId="file">
                    {note.attachment && (
                      <p>
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={note.attachmentURL}
                        >
                          {formatFilename(note.attachment)}
                        </a>
                      </p>
                    )}
                    <Form.Control onChange={handleFileChange} type="file" />
                  </Form.Group>
                
                 <LanguageSelector /> 

                  <div className = "submission"> 
                  <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                  >
                      Save
                  </LoaderButton>
                  <LoaderButton
                    block
                    size="lg"
                    variant="outline-danger"
                    onClick={handleDelete}
                    isLoading={isDeleting}
                  >
                      Delete
                  </LoaderButton>
                  </div>

                </Card.Body>
              </Card>
            </div>
            </div> 
        </Form>
      )}
    </div>
  );
}