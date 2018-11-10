import React from 'react';
import Graph from 'react-graph-vis';
import Modal from 'react-modal';

// component imports
import LeftPanel from './components/leftPanel';

// supplemental functions
import fetchData from './supplement/fetch';

// material ui
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles/drawerStyles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import { createMuiTheme } from '@material-ui/core/styles';
import GithubCorner from 'react-github-corner'
import blue from '@material-ui/core/colors/blue';


// const theme = createMuiTheme({
//   typography: {
//     useNextVariants: true,
// 	},
// 	palette: {
// 		primary: blue,
// 	}
// });

// React-modal details
const customStyles = {
  content : {
    top: 'auto',
    left: '73%',
		right: '2%',
    bottom: '5%',
		background: 'rgba(55, 145, 170, 0.8)',
		color: 'white',
		fontFamily: 'Roboto',
  }
};

Modal.setAppElement(document.getElementById('index'))

// React-graph-vis details
var options = {
		autoResize: true,
    layout: {
      hierarchical: {
				enabled: true,
				levelSeparation: 100,
				nodeSpacing: 200,
				treeSpacing: 100,
				blockShifting: true,
				edgeMinimization: true,
				parentCentralization: true,
				direction: 'UD',        // UD, DU, LR, RL
				sortMethod: 'directed'   // hubsize, directed
			}
		},
		interaction: {
			keyboard: {
				enabled: true,
				speed: {
					x:10,
					y:10,
					zoom:0.01,
				},
				bindToWindow: true,
			},
		},
		physics: {
			enabled: true,
			repulsion: {
				nodeDistance: 200,
			},
		},
    edges: {
			color: "#000000",
		},
		width: '100%',
		height: '100%',
		nodes: {
			shape: 'image',
			// icon: {
			// 	face: '"Font Awesome 5 Free"',
			// 	code: '\uf466',
			// 	size: 30,
			// 	color: 'black'
			// },
			image: {
				selected: 'https://camo.githubusercontent.com/f8ea5eab7494f955e90f60abc1d13f2ce2c2e540/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323037383234352f3235393331332f35653833313336322d386362612d313165322d383435332d6536626439353663383961342e706e67',
				unselected: 'https://camo.githubusercontent.com/f8ea5eab7494f955e90f60abc1d13f2ce2c2e540/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323037383234352f3235393331332f35653833313336322d386362612d313165322d383435332d6536626439353663383961342e706e67'
			}
		},
		
};

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
				select: this.selectItem
			},
			modalIsOpen: false,

			// drawer states
			open: true,
    	anchor: 'left',
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.handleDrawerClose = this.handleDrawerClose.bind(this);
		this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
		this.handleChangeAnchor = this.handleChangeAnchor.bind(this);
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

	// when an item is selected, it will open a modal window and show information related to that item 
	selectItem = (event) => {
		var { nodes, edges } = event;
		console.log('stategraphnodes',this.state.graph.nodes);
		let foundNode = this.state.graph.nodes.find((element) => {
			return element.id === nodes[0];
		})
		console.log('foundnode',foundNode);	
		// console.log('metadata',foundNode.metadataName)
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
	
	// when component is rendered, create fetch request
	componentDidMount () {
		fetchData(this.state.graph.nodes, this.state.graph.edges, this.state.graph, this)
	}

	render() {
		// gets the state and props for drawer
		const { classes, theme } = this.props;
    const { anchor, open } = this.state;

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
		let before = null;
    let after = null;
    if (anchor === 'left') {
      before = leftPanel;
    } 

		// Modal - checks the type of Object when selected
		let type;
		if (this.state.kind === "Service") {
			console.log(this.state.modalIsOpen);
			type =
			<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles} >
				<h2 ref={subtitle => this.subtitle = subtitle}>{this.state.kind}</h2>
				<div>Name: {this.state.label}</div>
				<div>Created on: {this.state.timeStamp}</div>
				<div>Phase: {this.state.statusPhase}</div>
				<div>Port: {this.state.port}</div>
				<div>Target Port: {this.state.targetPort}</div>
				<div>Cluster IP: {this.state.clusterIP}</div>
				<Button 
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
        <div>Name: {this.state.name}</div>
				<div>Created on: {this.state.timeStamp}</div>
				<br/>
				<div className="serviceLeft">Services 
					<ul>
				  	{this.state.services.map((obj,i) => {
						return <li key={i}>{obj.serviceName} {obj.servicePort}</li>
						})}
					</ul>
				</div>
				{/* <div className="serviceRight">Service Port 
					<ul>
				  	{this.state.services.map((obj,i) => {
						return <li key={i}>{obj.servicePort}</li>
						})}
					</ul>
				</div> */}
        <Button 
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
          <AppBar
            className={classNames(classes.appBar, {
              [classes.appBarShift]: open,
              [classes[`appBarShift-${anchor}`]]: open,
            })}
          >
						{/* <Grid
							container
							direction="row"
							justify="space-between"
							alignItems="center"
						> */}
							<Toolbar disableGutters={!open}>
								<IconButton
									color="inherit"
									aria-label="Open drawer"
									onClick={this.handleDrawerOpen}
									className={classNames(classes.menuButton, open && classes.hide)}
								>
									<MenuIcon />
								</IconButton>
								<Typography variant="h6" color="inherit" noWrap>
									SPEKT8
								</Typography>
							</Toolbar>
							{/* Github banner on the top right */}
							<div className={classes.githubWrapper}>
								<GithubCorner href="https://github.com/spekt8/spekt8" size="65" bannerColor="white" octoColor="#2196f3"/>
							</div>
						{/* </Grid> */}
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
            <div className="rightSide">
							<Graph graph={this.state.graph} options={options} events={this.state.events} />
							{type}
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

export default withStyles(styles, { withTheme: true })(App);
