import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';

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
  }
});

class Legend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: ['pod'],
    }
  }

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List>
          {/* Title */}
          <Typography id="legendtitle" variant="h6" className={classes.typo}>Legend</Typography>

          {/* 1st Item */}
          <ListItem>
            <ListItemIcon>
              <WifiIcon />
            </ListItemIcon>
            <ListItemText primary="Pod" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle('pod')}
                checked={this.state.checked.indexOf('pod') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>

          {/* 2nd Item */}
          <ListItem>
            <ListItemIcon>
              <BluetoothIcon />
            </ListItemIcon>
            <ListItemText primary="Service" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle('service')}
                checked={this.state.checked.indexOf('service') !== -1}
              />
            </ListItemSecondaryAction>
          </ListItem>

          {/* 3rd Item */}
          <ListItem>
            <ListItemIcon>
              <BluetoothIcon />
            </ListItemIcon>
            <ListItemText primary="Ingress" />
            <ListItemSecondaryAction>
              <Switch
                onChange={this.handleToggle('ingress')}
                checked={this.state.checked.indexOf('ingress') !== -1}
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

export default withStyles(styles)(Legend);