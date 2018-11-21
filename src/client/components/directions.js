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
      
      
    </div>
  )
};

Directions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Directions);