import React from 'react';

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
      <Typography variant="h6" className={classes.paper}>Monitoring</Typography>

      {/* Sets up Horizontal Row */}
      <Grid
        container
        direction="row"
        justify="space-evenly"
        alignItems="center"
      >

        {/* Refresh Button */}
        <Paper className={classes.paper}>
            <Grid item>
              <Refresh />
            </Grid>
            <Grid item xs zeroMinWidth>
              <Typography noWrap>Refresh</Typography>
            </Grid>
        </Paper>

        {/* Live Monitoring */}
        <Paper className={classes.paper}>
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
