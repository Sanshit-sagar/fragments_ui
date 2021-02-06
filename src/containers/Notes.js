import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib"; 
import LoaderButton from "../components/LoaderButton"; 
import config from "../config"; 
import "./Notes.css"; 

import Form from "react-bootstrap/Form"; 
import SyntaxHighlighter from 'react-syntax-highlighter';
import {  
  dark, 
  ocean,
  atomOneLight,
  brownPaper,
  github,
  shadesOfPurple,
  rainbow } from "react-syntax-highlighter/dist/esm/styles/hljs";

import { Button } from "react-bootstrap"; 

import { 
    Paper, 
    Grid, 
    Select, 
    InputLabel, 
    MenuItem, 
    FormControl, 
    TextField,
    Divider
   } from "@material-ui/core"; 

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from "@material-ui/icons/Face"; 
import Filter1 from "@material-ui/icons/Filter1"; 
import Filter2 from "@material-ui/icons/Filter2"; 

export default function Notes() {
  const file = useRef(null);
  const { id } = useParams();
  const history = useHistory();
  const [note, setNote] = useState(null);

  const [content, setContent] = useState("");
  const [contentToRender, setContentToRender] = useState(""); 
  const [programmingLanguage, setProgrammingLanguage] = useState("java")

  const [highlightedSnippetTheme, setHighlightedSnippetTheme] = useState(dark)
  const [editorSnippetTheme, setEditorSnippetTheme] = useState("terminal")
  const [editorBackgroundColor, setEditorBackgroundColor] = useState("black")
  const [editorFontColor, setEditorFontColor] = useState("green")
  
  const [isLoading, setIsLoading] = useState(false); 
  const [isDeleting, setIsDeleting] = useState(false); 
  
  const [moniker, setMoniker] = useState("@"); 
  const [tag1, setTag1] = useState("#");
  const [tag2, setTag2] = useState("#");

  const [submitContent, setSubmitContent] = useState(""); 
 
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
        handleContentChange(content);  
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
      setIsLoading(false); 
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  function deleteNote() {
    return API.del("notes", `/notes/${id}`);
  }
  
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

  function handleLanguageSelectorChange(updatedLanguage) {
    setProgrammingLanguage(updatedLanguage); 
  }
 

  function LanguageSelector() {
    /*
      TODO: Place this component in it's own class and export it from there + import it 
            Use all the 50 languages it offers
    */
    return (
      <div className = "languageSelectorClass"> 
        <FormControl style = {{ minWidth: "330px", margin:"12.5px" }}> 
          <InputLabel htmlFor="grouped-native-select">Programming Language</InputLabel>
          <Select labelId="label" id="select" value={programmingLanguage} onChange={(e) => handleLanguageSelectorChange(e.target.value)}> 
            <MenuItem value="javascript"> JavaScript </MenuItem>
            <MenuItem value="html"> HTML </MenuItem>
            <MenuItem value="c++"> C++ </MenuItem>
            <MenuItem value="java"> Java </MenuItem>
          </Select>
        </FormControl>
      </div>
    ); 
  }

  function handleViewerThemeChange(updatedViewerTheme) {
    setHighlightedSnippetTheme(updatedViewerTheme); 
  }

  function ViewerThemeSelector() {
    return (
      <div className = "viewerThemeSelectorClass"> 
        <FormControl style = {{ minWidth: "330px", margin:"12.5px" }}> 
          <InputLabel htmlFor="grouped-native-select">Viewer Theme</InputLabel>
          <Select labelId="label" id="selectViewerTheme"
                  value={highlightedSnippetTheme} 
                  onChange={(e) => handleViewerThemeChange(e.target.value)}> 

            <MenuItem value={shadesOfPurple}> Shades Of Purple </MenuItem>
            <MenuItem value={dark}> Dark </MenuItem>
            <MenuItem value={github}> GitHub </MenuItem>
            <MenuItem value={ocean}> Ocean </MenuItem>
            <MenuItem value={atomOneLight}> Atom 1 Light </MenuItem>
            <MenuItem value={brownPaper}> Brown Paper </MenuItem>
            <MenuItem value={rainbow}> Rainbow </MenuItem>
          </Select>
        </FormControl>
      </div> 
    )
  }

  function handleEditorThemeChange(updatedEditorTheme) {
    setEditorSnippetTheme(updatedEditorTheme); 

    if(updatedEditorTheme == "terminal") {
      setEditorBackgroundColor("black");
      setEditorFontColor("green"); 
    } else {
      setEditorBackgroundColor("white");
      setEditorFontColor("black"); 
    }
  }

  function EditorThemeSelector() {
    return (
      <div className = "editorThemeSelectorClass"> 
        <FormControl style = {{ minWidth: "330px", margin:"12.5px", 
                                backgroundColor: "#ffffff", 
                                borderWidth:"5px", borderColor:"red" 
                              }}> 
                              
          <InputLabel htmlFor="grouped-native-select">Editor Theme</InputLabel>
          <Select labelId="label" id="selectEditorTheme"
                  value={editorSnippetTheme} 
                  onChange={(e) => handleEditorThemeChange(e.target.value)}> 

            <MenuItem value="terminal"> Terminal </MenuItem>
            <MenuItem value="classic"> Classic </MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }

  function ButtonGroup() {
    return (
      <div className="ButtonGroup" style={{ width: "90%", margin: "20px"}}>
        <LoaderButton block size="sm" type="submit" value="submit" 
                      isLoading={isLoading} disabled={!validateForm()}
                      style={{ backgroundColor:"white", color: "black", borderWidth: "2.5px", borderColor: "#202020" }}>
          Save
        </LoaderButton>
        
        <LoaderButton variant="dark" block size="sm" onClick={handleDelete} isLoading={isDeleting}>
          Delete
        </LoaderButton>
      </div>
    );
  }


  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));
  const classes = useStyles();
  
  function handleMonikerChange(updatedMoniker) {
      if(updatedMoniker.substring(0,1) != "@") {
          updatedMoniker = "@" + updatedMoniker; 
      }
      setMoniker(updatedMoniker); 
  }

  function handleTag1Update(updatedTag1) {
      if(updatedTag1.substring(0,1) != "#") {
          updatedTag1 = "#" + updatedTag1; 
      }
      setTag1(updatedTag1); 
  }

  function handleTag2Update(updatedTag2) {
      if(updatedTag2.substring(0,1) != "#") {
          updatedTag2 = "#" + updatedTag2; 
      }
      setTag2(updatedTag2); 
  }

  

  function handleContentChange(updatedContent) {
    const lines = (updatedContent.match(/\n/g) || '').length + 1

    if(lines <= 23) {
      //set a limit to the number of chars if typing on the 30th line 
      //if copying and pasting from 28 lines to 35, clip the first two lines 
      //and only append those 
      
      setContent(updatedContent);

      let snippetFillerForSyntaxHighlighter = ""; 
      let emptyLine = "                              \n"; 
      
      let i; 
      for(i = 0; i < 31 - lines; i++) {
        snippetFillerForSyntaxHighlighter += emptyLine; 
      } 

      setContentToRender(updatedContent + snippetFillerForSyntaxHighlighter); 
    }
  }


  return (
  <div className="mainContainer" style={{ backgroundColor: '#FFFFFFF'}}> 
    { note  && (
    
     <Form onSubmit={handleSubmit}>
        <Grid container spacing={1} style = {{ flexGrow: 1, backgroundColor: '#FFFFFF' }}> 
          <Grid item lg={6}> 
          
            <Paper rounded={true} elevation={20} style={{ height: '59.5vh', width: '100%' }}> 
              
              <Form.Group controlId="content">
                <Form.Control as="textarea" value={content} custom="true" 
                              onChange={(e) => handleContentChange(e.target.value)} 
                              style={{ minHeight:'59.5vh', maxHeight:'59.5vh',  width: '100%', resize: 'none', padding: '5px', 
                                        backgroundColor: editorBackgroundColor, color: editorFontColor, fontSize:'13px',  borderWidth: '1px' }}              
                />
              </Form.Group>   
            </Paper>
          
          </Grid>

          <Grid item lg={6} style = {{ flexGrow: 1, backgroundColor: '#FFFFFF' }}> 
            <Paper rounded={true} elevation={20} style={{ height: '59.5vh', width: '100%', padding: '5px' }}>
              <SyntaxHighlighter language={programmingLanguage} style={ highlightedSnippetTheme } 
                                  showLineNumbers wrapLongLines={false} > 
                { contentToRender }
              </SyntaxHighlighter>   
            </Paper>
          </Grid>      
           
          <Grid item lg={4} style = {{ backgroundColor: '#FFFFFF' }}>
            <Paper style={{ minHeight: "25vh", maxHeight: "25vh", backgroundColor: "#ffffff"  }}>
             
            <div className={classes.root}>
  
              <List component="nav" aria-label="main mailbox folders">
                <ListItem autofocus>
                    <ListItemIcon>
                        <FaceIcon />
                    </ListItemIcon>
                  

                    <ListItemText primary={ 
                        <TextField id="filled-basic" variant="filled" 
                                placeholder="@" size ="medium"
                                value={ moniker } 
                                onChange={(e) => handleMonikerChange(e.target.value)}
                        /> } 
                    />
                </ListItem>
              </List>

              <Divider />

              <List component="nav" aria-label="secondary mailbox folders">
                <ListItem autofocus>
                    <ListItemIcon>
                        <Filter1 />
                    </ListItemIcon> 

                    <ListItemText primary= {
                        <TextField id="filled-basic" variant="outlined" 
                                    placeholder="#" size ="medium"
                                    value={ tag1 } onChange={(e) => handleTag1Update(e.target.value)}
                        /> }
                    />
                </ListItem>

                <ListItem href="#simple-list">
                    <ListItemIcon>
                        <Filter2 />
                    </ListItemIcon>

                    <ListItemText secondary= {
                        <TextField id="filled-basic" variant="outlined" 
                                    placeholder="#" size ="medium"
                                    value={ tag2 } onChange={(e) => handleTag2Update(e.target.value)}                  /> }
                  />
                </ListItem>
              </List>
            </div>
            </Paper>
          </Grid>        
        
          <Grid item lg={4} style = {{ backgroundColor: '#ffffff' }}>
            <Paper style={{ minHeight: "25vh", maxHeight: "25vh", backgroundColor: "#ffffff" }}>
              <LanguageSelector />

              <ViewerThemeSelector />
            
              <EditorThemeSelector /> 
            </Paper>
          </Grid>       
          
        

          <Grid item lg={4}  style = {{  backgroundColor: '#FFFFFF' }}>
            <Paper style={{ minHeight: "25vh", maxHeight: "25vh", backgroundColor: "#FFFFFF" }}>
              <FormControl style={{ display: "flex", flexDirection:"row", width: "100%" }}>      
                <Button className="fileAttach1" variant="light" block size="sm" > 
                    <input type = "file"  onChange={handleFileChange} /> 
                </Button>

                <Button className="fileAttach2" variant="link" block size="sm" style={{ marginBottom: "20px" }}> 
                  { note.attachment && (
                      <p> <a target="_blank" rel="noopener noreferrer" href={note.attachmentURL}>
                      {formatFilename(note.attachment)}
                      </a> </p> 
                  )}
                </Button> 

              </FormControl>
              <ButtonGroup style={{ width:"80%" }} /> 
                
            </Paper>
          </Grid>       
             
        </Grid>
      </Form> 
     
    )}

    </div>
  );
}