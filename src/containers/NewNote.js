import React, { useRef, useState } from "react"; 
import Form from "react-bootstrap/Form";
import { useHistory } from "react-router-dom";
import LoaderButton from "../components/LoaderButton"; 
import { onError } from "../libs/errorLib";
import config from "../config"; import "./NewNote.css";
import { API } from "aws-amplify";
import { s3Upload } from "../libs/awsLib"; 
import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import Divider from '@material-ui/core/Divider';
import FaceIcon from "@material-ui/icons/Face"; 
import Filter1 from "@material-ui/icons/Filter1"; 
import Filter2 from "@material-ui/icons/Filter2"; 
import TextField from '@material-ui/core/TextField'; 

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function NewNote() {

    const file = useRef(null);
    const history = useHistory();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [moniker, setMoniker] = useState("@"); 
    const [primaryTags, setPrimaryTags] = useState("#");
    const [secondaryTags, setSecondaryTags] = useState("#");
    const classes = useStyles();
    
    function validateForm() { 
        return content.length > 0;
    }
    
    function handleFileChange(event) { 
        file.current = event.target.files[0];
    }
    
    async function handleSubmit(event) {
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
            const attachment = file.current ? await s3Upload(file.current) : null;

            await createNote({ content, moniker, primaryTags, secondaryTags, attachment });
            
            history.push("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function createNote(note) {
        return API.post("notes", "/notes", {
            body: note 
        });
    }

    function AttachmentCard() {
        return (
            <Form.Group controlId="file">
                <Form.Label>Attachment</Form.Label>
                <Form.Control onChange={handleFileChange} type="file" /> 
            </Form.Group>
        ); 
    }

    // function SnippetEditor() {
    //     return (
    //         <Form.Group controlId="content">
    //             <Form.Control
    //                 value={content}
    //                 as="textarea"
    //                 onChange={(e) => setContent(e.target.value)}
    //             />
    //         </Form.Group>
    //     ); 
    // }

    function handleMonikerChange(updatedMoniker) {
        if(updatedMoniker.substring(0,1) != "@") {
            updatedMoniker = "@" + updatedMoniker; 
        }
        setMoniker(updatedMoniker); 
    }

    function handlePrimaryTagsUpdate(updatedPrimaryTags) {
            if(updatedPrimaryTags.substring(0,1) != "#") {
                updatedPrimaryTags = "#" + updatedPrimaryTags; 
            }
            setPrimaryTags(updatedPrimaryTags); 
    }

    function handleSecondaryTagsUpdate(updatedSecondaryTags) {
            if(updatedSecondaryTags.substring(0,1) != "#") {
                updatedSecondaryTags = "#" + updatedSecondaryTags; 
            }
            setSecondaryTags(updatedSecondaryTags); 
    }


    return (
        <div className="NewNote">
            <Form onSubmit={handleSubmit}> 
                <Form.Group controlId="content">
                    <Form.Control
                        value={content}
                        as="textarea"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <AttachmentCard /> 

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
                                />} 
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
                                            value={ primaryTags } 
                                            onChange={(e) => handlePrimaryTagsUpdate(e.target.value)}
                                /> }
                            />
                        </ListItem>

                        <ListItem autofocus>
                            <ListItemIcon>
                                <Filter2 />
                            </ListItemIcon>

                            <ListItemText secondary= {
                                <TextField id="filled-basic" variant="outlined" 
                                            placeholder="#" size ="medium"
                                            value={ secondaryTags } 
                                            onChange={(e) => handleSecondaryTagsUpdate(e.target.value)}                  
                                /> }
                            />
                        </ListItem>
                    </List>

                    <LoaderButton block type="submit" size="lg" variant="primary" isLoading={isLoading} disabled={!validateForm()}>
                        <h5> Create </h5> 
                    </LoaderButton>
                </div>
                
                
            </Form>
        </div>
    );
}