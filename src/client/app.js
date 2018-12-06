/**
 * @description main
 */

import React from 'react';
import Graph from 'react-graph-vis';
import Modal from 'react-modal';

// component imports
import LeftPanel from './components/leftPanel';
import Table from './components/table';

// supplemental functions
import fetchData from './supplement/fetch';
import options from './supplement/graphOptions';

// material ui
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles/drawerStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuIcon from '@material-ui/icons/Menu';
import GithubCorner from 'react-github-corner';
import Divider from '@material-ui/core/Divider';

// drop-down menu
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';

// import redux
import { connect } from 'react-redux';

// import images
import img from './images/k8slogo.png';

// React-modal details
const customStyles = {
  content : {
    top: 'auto',
    left: '73%',
		right: '2%',
    bottom: '5%',
		background: 'white',
		color: 'black',
		fontFamily: 'Roboto',
  }
};
Modal.setAppElement(document.getElementById('index'));


class App extends React.Component {
  constructor(props) {
		super(props);

		// our state object
		this.state = {
			// graph represents our component
			graph: {
				nodes: [],
				edges: []
			},
			nodeSelected: false,
			// pass events object down to our render method which will invoke our selectItem method
			events: {
				select: this.selectItem,
				hoverNode: this.hoverNode,
				blurNode: this.blurNode,
				dragStart: this.dragStart,
				dragging: this.dragging,
				dragEnd: this.dragEnd
			},
			modalIsOpen: false,
			// drawer states
			open: true,
			anchor: 'left',
			// change view menu open
			menuOpen: false,
			graphTable: 'graph',
			checked: this.props.checked
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleDrawerClose = this.handleDrawerClose.bind(this);
		this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
		this.handleChangeAnchor = this.handleChangeAnchor.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleGraphClose = this.handleGraphClose.bind(this);
		this.handleTableClose = this.handleTableClose.bind(this);
		// this.filterNode = this.filterNode.bind(this);
	}

	// Modal Functions
	openModal() {
		this.setState({modalIsOpen: true});
	}
	closeModal() {
		this.setState({modalIsOpen: false});
	}

	// Drawer Functions
	handleDrawerOpen = () => {
    this.setState({ open: true });
  };
  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  handleChangeAnchor = event => {
    this.setState({
      anchor: event.target.value,
    });
	};
	
	// View Menu Functions
	handleToggle = () => {
    this.setState(state => ({ menuOpen: !state.menuOpen }));
  };
  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
		}
    this.setState({ menuOpen: false });
	};
	handleGraphClose = () => {
		this.setState({ graphTable: 'graph', menuOpen: false })
	}
	handleTableClose = () => {
		this.setState({ graphTable: 'table', menuOpen: false })
	}

	// cursor change event methods
	hoverNode = () => {
		document.body.style.cursor = "pointer";
	}
	blurNode = () => {
		document.body.style.cursor = "default";
	}
	dragStart = () => {
		document.body.style.cursor = "pointer";
	}
	dragging = () => {
		document.body.style.cursor = "grabbing";
	}
	dragEnd = () => {
		document.body.style.cursor = "default";
	}

	// when an item is selected, it will open a modal window and show information related to that item 
	selectItem = (event) => {
		var { nodes, edges } = event;
		console.log('stategraphnodes',this.state.graph.nodes);
		let foundNode = this.state.graph.nodes.find((element) => {
			return element.id === nodes[0];
		})
		console.log('foundnode',foundNode);	
		if (foundNode.kind === "Pod") {  
			this.setState(prevState => {
				return {
					modalIsOpen: true,
					kind: foundNode.kind,
					metadataName: foundNode.metadataName,
					timeStamp: foundNode.timeStamp,
					statusPhase: foundNode.statusPhase,
					hostIP: foundNode.hostIP,
					podIP: foundNode.podIP,
					containerName: foundNode.containerName,
					containerImage: foundNode.containerImage,
					volumeName: foundNode.volumename,
					pvcName: foundNode.pvcname,
				}
			})
		} else if (foundNode.kind === "Service") {
			this.setState(prevState => {
				return {
					modalIsOpen: true,
					kind: foundNode.kind,
					label: foundNode.label,
					timeStamp: foundNode.timeStamp,
					port: foundNode.port,
					targetPort: foundNode.targetPort,
					clusterIP: foundNode.clusterIP,
				}
			})
		} else if (foundNode.kind === "Ingress") {
			this.setState(prevState => {
				return {
					modalIsOpen: true,
					kind: foundNode.kind,
					name: foundNode.name,
					services: foundNode.services,
					timeStamp: foundNode.timeStamp,
				}
			})
		} 
	}
	
	filterNode() {
		let { checked } = this.props;

		const edgesCopy = this.state.graph.edges.slice();
		const nodeCopy = this.state.graph.nodes.map(ele => {
			if (ele.kind && ele.id) {
				if (checked.includes(ele.kind.toLowerCase())) {
					const eleCopy = Object.assign({}, ele);
					eleCopy.hidden = false;
					return eleCopy;
				} else {
					const eleCopy = Object.assign({}, ele);
					eleCopy.hidden = true;
					return eleCopy;
				}
			} else {
				return ele;
			}	
		})
		
		this.setState({
			graph: {
				nodes: nodeCopy,
				edges: edgesCopy
			}
		})
	}

	// when component is rendered, create fetch request
	componentDidMount() {
		let promise = fetchData(this.state.graph.nodes, this.state.graph.edges, this.state.graph, this)
		promise.then(() => {
			this.filterNode();
		})
		// setTimeout(() => {
		// 	this.filterNode();
		// }, 2000)
	}
	
	componentDidUpdate(prevProps) {
		if (this.props.checked.length !== prevProps.checked.length) {
			this.filterNode();
		}
	}

	render() {
		console.log(this.state.graph.nodes);
		// gets the state and props for drawer
		const { classes, theme, checked } = this.props;
    const { anchor, open, menuOpen } = this.state;

		// creates the drawer/left-panel component
		const leftPanel = (
			<LeftPanel 
			  // passing state in order to update state within our monitoring component to refresh the page
				nodes={this.state.graph.nodes}
				edges={this.state.graph.edges}
				graph={this.state.graph}
				that={this}
				// props for the drawer
				anchor={this.state.anchor} 
				open={this.state.open} 
				classes={classes} 
				theme={theme}
				handleDrawerClose={this.handleDrawerClose}
			/>
		);
		// adds functionality for showing and hiding drawer
		let before = null;
    let after = null;
    if (anchor === 'left') {
      before = leftPanel;
    } 

		// View Style - renders Graph or Table Component based on graphTable state
		let viewStyle;
		if (this.state.graphTable === 'graph') {
			viewStyle = <Graph graph={this.state.graph} options={options} events={this.state.events} />
		} else if (this.state.graphTable === 'table') {
			viewStyle = <Table graph={this.state.graph} />
		}

		// Legend Filter - hides based on the Legend Switches

		// Modal - checks the type of Object when selected
		let type;
		if (this.state.kind === "Service") {
			console.log(this.state.modalIsOpen);
			type =
			<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles} >
				<h2 ref={subtitle => this.subtitle = subtitle}>{this.state.kind}</h2>
				<Divider style={{'background-color':'#9CABB8'}} />
				<div>Name: {this.state.label}</div>
				<div>Created on: {this.state.timeStamp}</div>
				<div>Phase: {this.state.statusPhase}</div>
				<div>Port: {this.state.port}</div>
				<div>Target Port: {this.state.targetPort}</div>
				<div>Cluster IP: {this.state.clusterIP}</div>
				<Button 
					id="serviceModalButton"
					variant="contained" 
					color="default" 
					onClick={this.closeModal} 
					className={classes.button}
				>
					Close
				</Button>
			</Modal> 
		} else if (this.state.kind === "Pod") {
			type = 
			<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
        <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.kind}</h2>
				<Divider style={{'background-color':'#9CABB8'}} />
        <div>Name: {this.state.metadataName}</div>
				<div>Created on: {this.state.timeStamp}</div>
				<div>Phase: {this.state.statusPhase}</div>
				<div>Pod IP: {this.state.podIP}</div>
				<div>Host IP: {this.state.hostIP}</div>
				<br/>
				<div className="containerinfo">Containers<br/></div>
				<div>Name: {this.state.containerName}</div>
				<div>Image: {this.state.containerImage}</div>
				<br/>
				<div className="PVC">Volumes</div>
				<div>Name: {this.state.volumeName}</div>
				<div>PVC: {this.state.pvcName ? this.state.pvcName : "Not applicable"}</div>
				<Button 
					id="podModalButton"
					variant="contained" 
					color="default" 
					onClick={this.closeModal} 
					className={classes.button}
				>
					Close
				</Button>
      </Modal>
		} else if (this.state.kind === "Ingress") {
			console.log('service',this.state.services);
			type = 
			<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
        <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.kind}</h2>
				<Divider style={{'background-color':'#9CABB8'}} />
        <div>Name: {this.state.name}</div>
				<div>Created on: {this.state.timeStamp}</div>
				<br/>
				<div className="serviceLeft">Services 
					<ul>
				  	{this.state.services.map((obj,i) => {
						return <div key={i}>{obj.serviceName} {obj.servicePort}</div>
						})}
					</ul>
				</div>
				<Button 
					id="ingressModalButton"
					variant="contained" 
					color="default" 
					onClick={this.closeModal} 
					className={classes.button}
				>
					Close
				</Button>
      </Modal>
		}
		  
		return (
			<div className={classes.root}>
        <div className={classes.appFrame}>
					{/* Top Header Portion */}
					{/* Persistent Drawer */}
          <AppBar id="appbar"
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open,
            })}
          >
						
						<Toolbar disableGutters={!open}>
							<IconButton
								color="inherit"
								aria-label="Open drawer"
								onClick={this.handleDrawerOpen}
								className={classNames(classes.menuButton, open && classes.hide)}
							>
								<MenuIcon />
							</IconButton>
							<Grid
								container
								direction="row"
								justify="space-between"
								alignItems="center"
								color="primary"
							>
							{/* can add any titles here */}
							<div id="kubernetestitle">Kubernetes and Docker Visualization</div>
								{/* View Menu */}
								<div className="viewMenu">
									<Button
										id="viewButton"
										buttonRef={node => {
											this.anchorEl = node;
										}}
										aria-owns={menuOpen ? 'menu-list-grow' : undefined}
										aria-haspopup="true"
										onClick={this.handleToggle}
										variant="contained"
									>
										<KeyboardArrowDown id="viewArrow"/>View
									</Button>
									<Popper open={menuOpen} anchorEl={this.anchorEl} transition disablePortal>
										{({ TransitionProps, placement }) => (
											<Grow
												{...TransitionProps}
												id="menu-list-grow"
												style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
											>
												<Paper>
													<ClickAwayListener onClickAway={this.handleClose}>
														<MenuList id="menuListButton">
															<MenuItem id="graphLabel" onClick={this.handleGraphClose}>Graph</MenuItem>
															<MenuItem id="tableLabel" onClick={this.handleTableClose}>Table</MenuItem>
														</MenuList>
													</ClickAwayListener>
												</Paper>
											</Grow>
										)}
									</Popper>
								</div>
							</Grid>
							
						</Toolbar>
						{/* Github banner on the top right */}
						<div className={classes.githubWrapper}>
							<GithubCorner href="https://github.com/spekt8/spekt8" size="65" bannerColor="rgb(233, 227, 202)" octoColor="#08182E"/>
						</div>
          </AppBar>
					{before}
          <main
            className={classNames(classes.content, classes[`content-${anchor}`], {
              [classes.contentShift]: open,
              [classes[`contentShift-${anchor}`]]: open,
            })}
          >
            <div className={classes.drawerHeader} />
					{/* end header section */}

						{/* right side should go over here */}
						<div className="rightSide" >
            	<div id='k8sContainer'>
								<div id='k8simage'><img src={img}/></div>
								{viewStyle}
								{type}
							</div>
						</div>
						{/* end right side */}
          </main>
          {after}
        </div>
      </div>
		)
	}
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    checked: state.graphing.checked
  }
}

App = connect(mapStateToProps)(App);

export default withStyles(styles, { withTheme: true })(App);
