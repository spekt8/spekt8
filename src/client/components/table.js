import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// redux
import { connect } from 'react-redux';

// styling for the table cell
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

// inline styles for the table
const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});


let TableData = (props) => {
  const { classes, checked } = props;
  const { nodes } = props.graph;

  const podArray = [];
  const serviceArray = [];
  const ingressArray = [];

  // takes the graph data and iterates over to put them into separate arrays
  if (nodes) {
    for (let i = 0; i < nodes.length; i += 1) {
      if (nodes[i].kind === 'Pod') {
        podArray.push(nodes[i]);
      } else if (nodes[i].kind === 'Service') {
        serviceArray.push(nodes[i]);
      } else if (nodes[i].kind === 'Ingress') {
        ingressArray.push(nodes[i]);
      }
    }
  }

  // adds table based on the switch statements
  let tableList = [];
  for (let i = 0; i < checked.length; i += 1) {
    if (checked[i] === 'pod') {
      tableList.push(
        <Paper className={classes.root} key={`table${i}`}>
          <Table className={classes.table}>
            {/* Table Head */}
            <TableHead>
              <TableRow>
                <CustomTableCell>Pods</CustomTableCell>
                <CustomTableCell>Container-Name</CustomTableCell>
                <CustomTableCell>Host-IP</CustomTableCell>
                <CustomTableCell>Pod-IP</CustomTableCell>
                <CustomTableCell>Status</CustomTableCell>
                <CustomTableCell>Volume-Name</CustomTableCell>
              </TableRow>
            </TableHead>

            {/* Table Main */}
            <TableBody>
              {podArray.map(pod => {
                return (
                  <TableRow className={classes.row} key={pod.id}>
                    <CustomTableCell component="th" scope="row">
                      {pod.metadataName}
                    </CustomTableCell>
                    <CustomTableCell>{pod.containerName}</CustomTableCell>
                    <CustomTableCell>{pod.hostIP}</CustomTableCell>
                    <CustomTableCell>{pod.podIP}</CustomTableCell>
                    <CustomTableCell>{pod.statusPhase}</CustomTableCell>
                    <CustomTableCell>{pod.volumename}</CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )
    }
    if (checked[i] === 'service') {
      tableList.push(
        <Paper className={classes.root} key={`table${i}`}>
          <Table className={classes.table}>
            {/* Table Head */}
            <TableHead>
              <TableRow>
                <CustomTableCell>Services</CustomTableCell>
                <CustomTableCell>Cluster-IP</CustomTableCell>
                <CustomTableCell>Port</CustomTableCell>
                <CustomTableCell>Target-Port</CustomTableCell>
                <CustomTableCell>Time-Stamp</CustomTableCell>
              </TableRow>
            </TableHead>

            {/* Table Main */}
            <TableBody>
              {serviceArray.map(service => {
                return (
                  <TableRow className={classes.row} key={service.id}>
                    <CustomTableCell component="th" scope="row">
                      {service.label}
                    </CustomTableCell>
                    <CustomTableCell>{service.clusterIP}</CustomTableCell>
                    <CustomTableCell>{service.port}</CustomTableCell>
                    <CustomTableCell>{service.targetPort}</CustomTableCell>
                    <CustomTableCell>{service.timeStamp}</CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      );
    }
    if (checked[i] === 'ingress') {
      tableList.push(
        <Paper className={classes.root} key={`table${i}`}>
          <Table className={classes.table}>
            {/* Table Head */}
            <TableHead>
              <TableRow>
                <CustomTableCell>Ingress</CustomTableCell>
                <CustomTableCell>Service-List</CustomTableCell>
              </TableRow>
            </TableHead>

            {/* Table Main */}
            <TableBody>
              {ingressArray.map(ingress => {
                return (
                  <TableRow className={classes.row} key={ingress.id}>
                    <CustomTableCell component="th" scope="row">
                      {ingress.name}
                    </CustomTableCell>
                    {/* <CustomTableCell>dsfasdfs</CustomTableCell> */}
                    <CustomTableCell>{ingress.services.map((service, i) => {
                      return (
                        <div key={`serviceItem${i}`}>{service.serviceName}, </div>
                      )
                    })}</CustomTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )
    }
  }

  return (
    <div className="tableRight">
      {tableList}
    </div>
  );
}

TableData.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    checked: state.graphing.checked
  }
}

TableData = connect(mapStateToProps)(TableData);

export default withStyles(styles)(TableData);
