import React, { useState } from 'react';
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

export default function SimpleList() {

  const [moniker, setMoniker] = useState("@"); 
  const [tag1, setTag1] = useState("#");
  const [tag2, setTag2] = useState("#");
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

  return (
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
  );
}