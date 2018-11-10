import React from 'react';

// component imports
import Directions from './directions';
import Legend from './legend';
import Monitoring from './monitoring';

// material ui design
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

const LeftPanel = (props) => {
  return (
    <Drawer
        variant="persistent"
        anchor={props.anchor}
        open={props.open}
        classes={{
          paper: props.classes.drawerPaper,
        }}
      >
      
      <div className={props.classes.drawerHeader}>
        <Typography variant="h6">K8s Visualization</Typography>

        <IconButton onClick={props.handleDrawerClose}>
          {props.theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>

      {/* this is where you write for the inside of the drawer */}
      {/* Legend */}
      <Divider />
      <Legend />

      {/* Monitoring */}
      <Divider />
      <Divider />
      <Monitoring 
        nodes={props.nodes}
        edges={props.edges}
        graph={props.graph}
        that={props.that}
      />

      {/* Directions */}
      <Divider />
      <Directions />

    </Drawer>
  )
}

export default LeftPanel;
