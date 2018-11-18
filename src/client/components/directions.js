import React from 'react';

// material ui
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';

const styles = theme => ({
  title: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    textAlign: 'center'
  },
  arrowSize: {
    width: 40,
    height: 40,
  }
});

const Directions = (props) => {
  const { classes } = props;

  return (
    <div className="directions">
      {/* Title */}
      <Typography id="pageslabel" variant="h6" className={classes.title}>Pages</Typography>
      
      {/* Top Row for Arrows */}
      <Grid container 
        direction="row"
        justify="space-around"
        alignItems="center"
        spacing={24}
      >
        <Grid item xs>
          <ZoomOut style={{color: '#9CABB8' }} />
        </Grid>
        <Grid item xs>
          <ArrowDropUp style={{color: '#9CABB8' }} className={classes.arrowSize}/>
        </Grid>
        <Grid item xs>
          <ZoomIn style={{color: '#9CABB8' }} />
        </Grid>
      </Grid>

      {/* Bottom Row for Arrows */}
      <Grid container 
        direction="row"
        justify="space-around"
        alignItems="center"
        spacing={24}
      >
        <Grid item xs>
          <ArrowLeft style={{color: '#9CABB8' }} className={classes.arrowSize}/>
        </Grid>
        <Grid item xs>
          <ArrowDropDown style={{color: '#9CABB8' }} className={classes.arrowSize}/>
        </Grid>
        <Grid item xs>
          <ArrowRight style={{color: '#9CABB8' }} className={classes.arrowSize}/>
        </Grid>
      </Grid>
      
    </div>
  )
};

Directions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Directions);