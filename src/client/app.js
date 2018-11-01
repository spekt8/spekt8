import React from 'react';
import Graph from 'react-graph-vis';
import Infobox from './infobox';
import Modal from 'react-modal';

// React-modal details
const customStyles = {
  content : {
    top: '80%',
    left: '82%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
		background: 'rgba(105, 181, 202, 0.8)',
		color: 'white',
		fontFamily: 'sans-serif',
  }
};

Modal.setAppElement(document.getElementById('index'))

// React-graph-vis details
var options = {
    layout: {
      hierarchical: {
				enabled: true,
				levelSeparation: 100,
				nodeSpacing: 200,
				treeSpacing: 150,
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
		width: '1800px',
		height: '1000px',
		nodes: {
			shape: 'hexagon',
			size: 20,
		},
		
};

class App extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			graph: {
				nodes: [],
				edges: []
			},
			nodeSelected: false,
			// pass events object down to our render method which will invoke our selectItem method
			events: {
				select: this.selectItem
			},

			// // used to label pods
			// metadataName: '',
			// statusPhase: '',
			// kind: '',

			// //used to label services
			// label: '',
			// timeStamp: '',
			// port: '',
			// targetPort: '',
			// clusterIP: '',

			// modal state
			modalIsOpen: false
		};
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}

	closeModal() {
		this.setState({modalIsOpen: false});
	}

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
		} 
	}
	
	componentDidMount() {
		// this fetch receives the pod list
		fetch('http://localhost:3000')
		  .then((podData) => {
				// console.log(data);
				return podData.json();
			})
			.then((podObject) => {
				// this fetch receives the service list
				fetch('http://localhost:3000/service')
					.then((serviceData) => {
						return serviceData.json();
					})
					.then((serviceObject) => {
						console.log('serviceobject',serviceObject);
						// fetch('http://localhost:3000/ingress')
						  // .then((ingressData) => {
						// 		return ingressData.json();
						// 	})
						// 	.then((ingressObject) => {
								// console.log('ingressobject',ingressObject);
								// this creates a copy of the state 
								const newGraph = Object.assign({}, this.state.graph);
								newGraph.nodes = this.state.graph.nodes.slice();
								newGraph.edges = this.state.graph.edges.slice();

								// place service list and pod list into separate variables
								const serviceArray = [];
								const podArray = [];

								// this loop cycles through the service list and assigns them to their own boxes
								// console.log('serviceobject',serviceObject);
								for (let i = 0; i < serviceObject.items.length; i+=1) {
									const newServiceObject = {};
									// saving service object information
									newServiceObject.id = i;
									newServiceObject.kind = "Service";
									newServiceObject.label = serviceObject.items[i].metadata.name; // service display title
									newServiceObject.timeStamp = serviceObject.items[i].metadata.creationTimestamp;  // service timestamp
									newServiceObject.selector = serviceObject.items[i].spec.selector; // service selector
									newServiceObject.clusterIP = serviceObject.items[i].spec.clusterIP; // service IP 
									newServiceObject.port = serviceObject.items[i].spec.ports[0].port; // service port 
									newServiceObject.targetPort = serviceObject.items[i].spec.ports[0].targetPort; // service targetport 
									// designing service object
									newServiceObject.color = "orange";
									newServiceObject.shape = "box";
									newGraph.nodes.push(newServiceObject);
									serviceArray.push(newServiceObject);
								}
								// this loop cycles through the pod list and assigns them to their own boxes
								console.log('podObject',podObject);
								for (let i = 0; i < podObject.items.length; i+=1) { 
									const newPodObject = {};
									newPodObject.id = i + 10;
									newPodObject.kind = "Pod";
									newPodObject.label = 'Pods'; // pod display title
									// pending versus running pods
									if (podObject.items[i].status.phase === "Pending") {
										newPodObject.color = "yellow";
									}
									// loop through containers object
									for(let j = 0; j < podObject.items[i].spec.containers.length; j+=1) {
										newPodObject.containerName = podObject.items[i].spec.containers[j].name; // need to loop if multiple containers though
										newPodObject.containerImage = podObject.items[i].spec.containers[j].image; // need to loop if multiple containers though
									}
									newPodObject.labels = podObject.items[i].metadata.labels; // pod label
									newPodObject.metadataName = podObject.items[i].metadata.name;
									newPodObject.timeStamp = podObject.items[i].metadata.creationTimestamp;
									newPodObject.statusPhase = podObject.items[i].status.phase;
									newPodObject.hostIP = podObject.items[i].status.hostIP;
									newPodObject.podIP = podObject.items[i].status.podIP;
									newGraph.nodes.push(newPodObject);
									podArray.push(newPodObject);
								}
								// console log the current state of pods and services
								console.log('state',newGraph.nodes);

								// this checks whether the selector from the service object matches the labels from the pods object
								// loop through service selectors
								for (let j = 0; j < serviceArray.length; j+=1) {
									if (typeof serviceArray[j].selector === 'object') {
										const serviceSelectorKey = Object.keys(newGraph.nodes[j].selector);
										for (let k = 0; k < podArray.length; k+=1) {
											if (podArray[k].labels) {
												const podLabelsKey = Object.keys(podArray[k].labels);
												if (serviceArray[j].selector[serviceSelectorKey[0]] === podArray[k].labels[podLabelsKey[0]]) {
													const newEdge = {
														from: serviceArray[j].id,
														to: podArray[k].id
													};
													newGraph.edges.push(newEdge);
												}	
											}
										}
									}
								}	
								this.setState({
									graph: newGraph
								}) 
							// })
													
					})
			})
	}

	render() {
		let type;
		if(this.state.kind === "Service") {
			type = 
			<Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles} >
				<h2 ref={subtitle => this.subtitle = subtitle}>{this.state.kind}</h2>
				<div>Name: {this.state.label}</div>
				<div>Created on: {this.state.timeStamp}</div>
				<div>Phase: {this.state.statusPhase}</div>
				<div>Port: {this.state.port}</div>
				<div>Target Port: {this.state.targetPort}</div>
				<div>Cluster IP: {this.state.clusterIP}</div>
				<button className="closeButton" onClick={this.closeModal}>close</button>
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
				<div>&nbsp;&nbsp;Name: {this.state.containerName}</div>
				<div>&nbsp;&nbsp;Image: {this.state.containerImage}</div>
        <button className="closeButton" onClick={this.closeModal}>close</button>
      </Modal>
		}
		  
		return (
		<div>
			<h1>SPECT8: Visualization Tool for Kubernetes</h1>
			<Graph graph={this.state.graph} options={options} events={this.state.events} />;
			{type}
		</div>
		)
	}
}

export default App;