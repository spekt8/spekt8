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

// import image
import spekt8logo from '../images/spekt8-logo.png';

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
      <div className='leftheader'>
      <div className={props.classes.drawerHeader}>
        <div id="leftheadertitle" >S P E K T &nbsp;</div>
        <img src={spekt8logo} style={{ "height": "20px", "width": "20px"}} />
        <IconButton id="handledrawerbutton" onClick={props.handleDrawerClose}>
          {props.theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </div>
      </div>

      {/* this is where you write for the inside of the drawer */}
      {/* Legend */}
      <Divider style={{'backgroundColor':'#9CABB8'}}/>
      <Divider style={{'backgroundColor':'#9CABB8'}}/>
      <Legend />

      {/* Monitoring */}
      <Divider style={{'backgroundColor':'#9CABB8'}}/>
      <Divider style={{'backgroundColor':'#9CABB8'}}/>
      <Monitoring 
        nodes={props.nodes}
        edges={props.edges}
        graph={props.graph}
        that={props.that}
      />

      {/* Directions */}
      <Divider style={{'backgroundColor':'#9CABB8'}}/>
      <Divider style={{'backgroundColor':'#9CABB8'}}/>
      <Directions />

    </Drawer>
  )
}

export default LeftPanel;
