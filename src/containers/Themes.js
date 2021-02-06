import React from 'react'; 
import Typography  from '@material-ui/core/Typography'; 
import Container from  '@material-ui/core/Container'; 
import CssBaseline from '@material-ui/core/CssBaseline';
// import { makeStyles } from '@material-ui/core/styles'; 

// const useStyles = makeStyles((theme) => ({
//     typography: {
//         backgroundColor: '#212121',
//     }
// })); 

export default function Themes() {
    return (
        <React.Fragment> 
            <CssBaseline />
            <Container fixed> 
                <Typography component="div" style={{ backgroundColor: '#cfe8fc', height: '85vh' }} />
            </Container>
        </React.Fragment>
    ); 
}

