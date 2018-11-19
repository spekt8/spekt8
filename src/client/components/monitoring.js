import React from 'react';

// supplemental functions
import fetchData from './../supplement/fetch';

// material ui
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Refresh from '@material-ui/icons/Refresh';
import RemoveRedEye from '@material-ui/icons/RemoveRedEye';
const styles = theme => ({
  wrapper: {
    maxWidth: 400,
  },
  paper: {
    cursor: 'pointer',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    textAlign: 'center'
  },
});

const Monitoring = (props) => {
  const { classes } = props;

  return (
    <div className="monitoring">
      {/* Title */}
      <Typography id="monitoringlabel" variant="h6" className={classes.paper}>Monitoring</Typography>

      {/* Sets up Horizontal Row */}
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
        color="primary"
      >

        {/* Refresh Button */}
        <Paper id="refreshbutton" className={classes.paper} onClick={()=>fetchData(props.nodes,props.edges,props.graph,props.that)} >
            <Grid item>
              <Refresh />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography noWrap>Refresh</Typography>
            </Grid>
        </Paper>

        {/* Live Monitoring */}
        <Paper id="monitorbutton" className={classes.paper}>
            <Grid item>
              <RemoveRedEye />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography noWrap>Monitor</Typography>
            </Grid>
        </Paper>

      </Grid>

    </div>  
  )
}

Monitoring.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Monitoring);
