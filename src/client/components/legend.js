import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';

import blue from '@material-ui/core/colors/blue';
import purple from '@material-ui/core/colors/purple';


// image imports
import PodIcon from '../../../dist/_ionicons_svg_logo-codepen.svg';
import ServiceIcon from '../../../dist/_ionicons_svg_md-wifi.svg';
import IngressIcon from '../../../dist/_ionicons_svg_md-aperture.svg';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { handleLegendToggle } from '../actions/graphing'; 


const styles = theme => ({
  root: {
    width: '100%',
    height: '40%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  typo: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    textAlign: 'center'
  },
  colorSwitchBase: {
    color: purple[300],
  },
  colorBar: {
    backgroundColor: purple[1000]
  },
  
});

class Legend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {/* Title */}
          <Typography variant="h6" className={classes.typo}>Legend</Typography>

          {/* 1st Item */}
          <ListItem>
            <img src={PodIcon} style={{ "height": "40px", "width": "40px"}} />
            <ListItemText 
              disableTypography
              primary={<Typography variant="body1" style={{ color: '#000000' }}>Pods</Typography>}
            />
            <ListItemSecondaryAction>
              <Switch
                onChange={() => this.props.handleLegendToggle('pod')}
                checked={this.props.checked.indexOf('pod') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>

          {/* 2nd Item */}
          <ListItem>
            <img src={ServiceIcon} style={{ "height": "40px", "width": "40px"}} />
            <ListItemText primary="Service" />
            <ListItemSecondaryAction>
              <Switch
                onChange={() => this.props.handleLegendToggle('service')}
                checked={this.props.checked.indexOf('service') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>

          {/* 3rd Item */}
          <ListItem>
            <img src={IngressIcon} style={{ "height": "40px", "width": "40px"}} />
            <ListItemText primary="Ingress" />
            <ListItemSecondaryAction>
              <Switch
                onChange={() => this.props.handleLegendToggle('ingress')}
                checked={this.props.checked.indexOf('ingress') !== -1}
                classes={{
                  switchBase: classes.colorSwitchBase,
                  checked: classes.colorChecked,
                  bar: classes.colorBar,
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>

        </List>
      </div>
    );
  }
}

Legend.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    checked: state.graphing.checked
  }
}

const mapDispatchToProps = (dispatch) => { 
  return bindActionCreators({  
    handleLegendToggle
  }, dispatch) 
} 

Legend = connect(mapStateToProps, mapDispatchToProps)(Legend);

export default withStyles(styles)(Legend);