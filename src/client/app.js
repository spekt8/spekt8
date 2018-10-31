import React from 'react';
import Graph from 'react-graph-vis';

 
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
		physics: {
			enabled: true,
			repulsion: {
				nodeDistance: 200,
			},
		},
    edges: {
			color: "#000000",
		},
		width: '1000px',
		height: '1000px',
		nodes: {
			shape: 'hexagon',
			size: 20,
		},
		
};
 
// var events = {
//     select: function(event) {
// 			var { nodes, edges } = event;
// 			console.log(nodes);
// 			console.log('event',event);
// 			this.setState(prevState => {
// 				return {
// 					nodeSelected: !prevState.nodeSelected
// 				}
// 			})
// 		}
// }

class App extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			graph: {
				nodes: [],
				edges: []
			},
			nodeSelected: false,
			events: {
				select: this.selectItem
			}
		};

		// this.handleClick = this.handleClick.bind(this);
		// this.selectItem = this.selectItem.bind(this);
	}

	selectItem = (event) => {
			var { nodes, edges } = event;
			console.log(nodes);
			console.log('event',event);
			// console.log(this);
			this.setState({
				nodeSelected: true
			})
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
						// console.log(serviceObject);

						// this creates a copy of the state 
						const newGraph = Object.assign({}, this.state.graph);
						newGraph.nodes = this.state.graph.nodes.slice();
						newGraph.edges = this.state.graph.edges.slice();

						// place service list and pod list into separate variables
						const serviceArray = [];
						const podArray = [];

						// this loop cycles through the service list and assigns them to their own boxes
						for (let i = 0; i < serviceObject.items.length; i+=1) {
							const newServiceObject = {};
							newServiceObject.id = i;
							newServiceObject.label = serviceObject.items[i].metadata.name; // service display title
							newServiceObject.selector = serviceObject.items[i].spec.selector; // service selector
							newServiceObject.color = "orange";
							newServiceObject.shape = "box";
							newGraph.nodes.push(newServiceObject);
							serviceArray.push(newServiceObject);
						}
						// this loop cycles through the pod list and assigns them to their own boxes
						for (let i = 0; i < podObject.items.length; i+=1) { 
							const newPodObject = {};
							newPodObject.id = i + 10;
							newPodObject.label = 'Pods'; // pod display title
							// pending versus running pods
							if (podObject.items[i].status.phase === "Pending") {
								newPodObject.color = "yellow";
							}
							newPodObject.labels = podObject.items[i].metadata.labels; // pod label
							newPodObject.metadataName = podObject.items[i].metadata.name;
							newPodObject.statusPhase = podObject.items[i].status.phase;
							newGraph.nodes.push(newPodObject);
							podArray.push(newPodObject);
						}
						// console log the current state of pods and services
						console.log('state',newGraph.nodes);

						// this checks whether the selector from the service object matches the labels from the pods object
						// loop through service selectors
						// console.log('servicearray', serviceArray);
						// console.log('podarray',podArray);
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
					})
			})
	}
	
	// select(event) {
	// 	const { nodeSelected } = this.state; 
	// 	var { nodes, edges } = event;
	// 	if (nodeSelected === false) {
	// 		console.log(nodes);
	// 		console.log('secondevent',event);
	// 	}
	// 	// this.setState(())
		
	// }

	// componentDidMount() {
	// 	// this fetch receives the pod list
	// 	fetch('http://localhost:3000')
	// 	  .then((podData) => {
	// 			// console.log(data);
	// 			return podData.json();
	// 		})
	// 		.then((podObject) => {
	// 			// this fetch receives the service list
	// 			fetch('http://localhost:3000/service')
	// 				.then((serviceData) => {
	// 					return serviceData.json();
	// 				})
	// 				.then((serviceObject) => {
	// 					console.log(serviceObject);

	// 					// this creates a copy of the state 
	// 					const newGraph = Object.assign({}, this.state.graph);
	// 					newGraph.nodes = this.state.graph.nodes.slice();
	// 					newGraph.edges = this.state.graph.edges.slice();
	// 					// this loop cycles through the service list and assigns them to their own boxes
	// 					for (let i = 0; i < serviceObject.items.length; i+=1) {
	// 						const newServiceObject = {};
	// 						newServiceObject.id = i;
	// 						newServiceObject.label = serviceObject.items[i].metadata.name;
	// 						newServiceObject.selector = serviceObject.items[i].spec.selector;
	// 						newGraph.nodes.push(newServiceObject);
	// 					}
	// 					// this loop cycles through the pod list and assigns them to their own boxes
	// 					for (let i = 0; i < podObject.items.length; i+=1) { 
	// 						const newPodObject = {};
	// 						newPodObject.id = i + 10;
	// 						newPodObject.label = podObject.items[i].metadata.name + '\n' + podObject.items[i].status.phase;
	// 						newPodObject.labels = podObject.items[i].metadata.labels;
	// 						// console.log(newGraph.nodes);
	// 						// this checks whether the selector from the service object matches the labels from the pods object
	// 						if (typeof newGraph.nodes[i].selector === 'object') {
	// 							console.log(newGraph.nodes[i].selector);
	// 							const serviceSelectorKey = Object.keys(newGraph.nodes[i].selector);
	// 							// const podLabelKey = Object.keys(newGraph.nodes[i].labels);
	// 							for (let j = 0; j < newGraph.nodes.length; j+=1) {
	// 								// console.log('selector',newGraph.nodes[j])
	// 								if (newGraph.nodes[j].selector && newGraph.nodes[j].selector[serviceSelectorKey[0]] === newPodObject.labels[serviceSelectorKey[0]]) {
	// 									console.log('true');
	// 									const newEdge = {
	// 										from: newGraph.nodes[j].id,
	// 										to: newPodObject.id
	// 									};
	// 									newGraph.edges.push(newEdge);
	// 								}
	// 							}
	// 						}
	// 						// console.log(checkKey[0])
	// 						// console.log(newGraph.nodes[i].selector);
	// 						// console.log(newGraph.nodes[i].selector[checkKey[0]]);
	// 						// console.log(newPodObject.labels[checkKey[0]]);
							
							
	// 						newGraph.nodes.push(newPodObject);
	// 					}
	// 					this.setState({
	// 						graph: newGraph
	// 					}) 
					
	// 			})
	// 		})
	// }

	render() {
		console.log(this.state.graph);
		
		return (
		<div>
			{this.state.nodeSelected.toString()}
			<h1>Hello My Classy Friend</h1>
			{/* <button onClick={this.handleClick}>click me</button> */}
			<Graph graph={this.state.graph} options={options} events={this.state.events} />;
		</div>
		)
	}
}


export default App;