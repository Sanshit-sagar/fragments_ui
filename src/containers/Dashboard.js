import React from 'react'; 
import Typography  from '@material-ui/core/Typography'; 
import Container from  '@material-ui/core/Container'; 
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button'; 

import { Grid, Paper } from '@material-ui/core'; 
import { makeStyles } from '@material-ui/core/styles'; 

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paperSecondary: {
      padding: theme.spacing(2),
      textAlign: 'center',
      backgroundColor: '#212121', 
      height: '40vh',
    },
    paperPrimary: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: '#FFFFFF',
      height: '40vh',
    },
}));

function DashboardGrid() {
    const dashboardStyles = useStyles(); 

    return (
        <div className={dashboardStyles.root}> 
            <Grid container spacing={1}> 
                <Grid item lg={12} md={12} sm={12}> 
                    <Paper className={dashboardStyles.paperPrimary}>
                        
                    </Paper>
                </Grid>
                <Grid item lg={3}> 
                    
                </Grid>
                <Grid item lg={3} md={3} sm={6}> 
                    <Paper className={dashboardStyles.paperPrimary}> 
                        <Button size="large" variant="outlined" color="primary">
                            Tags
                        </Button>
                    </Paper>
                </Grid>
                <Grid item lg={3} md={3} sm={6}> 
                    <Paper className={dashboardStyles.paperPrimary}>
                        <Button size="large" variant="outlined" color="primary">
                            Search
                        </Button>
                    </Paper>
                </Grid>
                <Grid item lg={3} md={3} sm={6}> 
                    <Paper className={dashboardStyles.paperPrimary}>
                        <Button size="large" variant="outlined" color="primary">
                            Themes
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    ); 
}

export default function Dashboard() {
    return (
        <React.Fragment> 
            <CssBaseline />
            <Container fixed> 
                <Typography component="div" style={{ backgroundColor: '#FFFFFFF', height: '85vh' }}>

                    <DashboardGrid /> 

                </Typography>
            </Container>
        </React.Fragment>
    ); 
}

