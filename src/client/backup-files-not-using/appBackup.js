import React from 'react';
import Graph from 'react-graph-vis';
import Modal from 'react-modal';
import Header from './components/header';
import LeftPanel from './components/leftPanel';

// React-modal details
const customStyles = {
  content : {
    top: '75%',
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
			shape: 'icon',
			icon: {
				face: '"Font Awesome 5 Free"',
				code: '\uf466',
				size: 30,
				color: 'black'
			},
			image: {
				selected: 'https://camo.githubusercontent.com/f8ea5eab7494f955e90f60abc1d13f2ce2c2e540/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323037383234352f3235393331332f35653833313336322d386362612d313165322d383435332d6536626439353663383961342e706e67',
				unselected: 'https://camo.githubusercontent.com/f8ea5eab7494f955e90f60abc1d13f2ce2c2e540/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f323037383234352f3235393331332f35653833313336322d386362612d313165322d383435332d6536626439353663383961342e706e67'
			}
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
						fetch('http://localhost:3000/ingress')
						  .then((ingressData) => {
								return ingressData.json();
							})
							.then((ingressObject) => {
								console.log('ingressobject',ingressObject);
								// this creates a copy of the state 
								const newGraph = Object.assign({}, this.state.graph);
								newGraph.nodes = this.state.graph.nodes.slice();
								newGraph.edges = this.state.graph.edges.slice();

								// place service list and pod list into separate variables
								const serviceArray = [];
								const podArray = [];
								const ingressArray = [];

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
									newPodObject.volumename = podObject.items[i].spec.volumes[0].name;
									if (podObject.items[i].spec.volumes[0].persistentVolumeClaim) {
										newPodObject.pvcname = podObject.items[i].spec.volumes[0].persistentVolumeClaim.claimName;
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

								// this loops through the ingress object and saves to another array
								for (let i = 0; i < ingressObject.items.length; i+=1) {
									const newIngressObject = {};
									newIngressObject.id = i + 100;
									newIngressObject.kind = "Ingress";
									newIngressObject.label = "Ingress";
									newIngressObject.timeStamp = ingressObject.items[i].metadata.creationTimestamp; // ingress timestamp
									newIngressObject.name = ingressObject.items[i].metadata.name; // ingress name 
									// loop through to save the different services within the ingress object
									let servicePath = ingressObject.items[i].spec.rules[0].http.paths;
									newIngressObject.services = [];
									for (let j = 0; j < servicePath.length; j+=1) {
										const serviceObj = {};
										serviceObj.serviceName = servicePath[j].backend.serviceName;
										serviceObj.servicePort = servicePath[j].backend.servicePort;
										newIngressObject.services.push(serviceObj);
									}
									// design the ingress node
									newIngressObject.shape = "diamond";
									newIngressObject.color = "teal";
									console.log('newingressobject',newIngressObject);
									newGraph.nodes.push(newIngressObject);
									ingressArray.push(newIngressObject);
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
								
								// this checks whether the service is listed in an ingress object
								console.log('ingressArray',ingressArray);
								// console.log('serviceArray',serviceArray);
								if (ingressArray[0]) {
									for (let j = 0; j < ingressArray[0].services.length; j+=1) {
										for (let k = 0; k < serviceArray.length; k+=1) {
											// console.log(ingressArray[0].services[j])
											// console.log(serviceArray[k].label)
											if ((ingressArray[0].services[j].serviceName === serviceArray[k].label) && (ingressArray[0].services[j].servicePort === serviceArray[k].port)) {
												const newEdge2 = {
													from: ingressArray[0].id,
													to: serviceArray[k].id
												}
												newGraph.edges.push(newEdge2);
											}
										}
									}
								}
								
								this.setState({
									graph: newGraph
								}) 
							})				
					})
			})
	}

	render() {
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
				<div>Name: {this.state.containerName}</div>
				<div>Image: {this.state.containerImage}</div>
				<br/>
				<div className="PVC">Volumes</div>
				<div>Name: {this.state.volumeName}</div>
				<div>PVC: {this.state.pvcName ? this.state.pvcName : "Not applicable"}</div>
        <button className="closeButton" onClick={this.closeModal}>close</button>
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
        <button className="closeButton" onClick={this.closeModal}>close</button>
      </Modal>
		}
		  
		return (
		<div>
			<Header />

			<div className="main">
				{/* Left Panel of the Visualizer */}
				<LeftPanel />

				{/* Right Panel of the Visualizer */}
				<div className="rightSide">
					<Graph graph={this.state.graph} options={options} events={this.state.events} />
					{type}
				</div>
			</div>
		</div>
		)
	}
}

export default App;