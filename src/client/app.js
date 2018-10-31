import React from 'react';
import Graph from 'react-graph-vis';


 
var options = {
    layout: {
      hierarchical: {
				enabled: false,
				sortMethod: 'directed',
				nodeSpacing: 200,
			}
    },
    edges: {
        color: "#000000"
		},
		width: '1000px',
		height: '1000px',
		nodes: {
			shape: 'box'
		}

};
 
var events = {
    select: function(event) {
        var { nodes, edges } = event;
		}
	
}

class App extends React.Component {
  constructor(props) {
    super(props);
		this.state = {
			graph: {
				nodes: [],
				edges: []
			}
		}	
		// this.handleClick = this.handleClick.bind(this);
	}
	
	componentDidMount() {
		// this fetch receives the pod list
		fetch('http://localhost:3000')
		  .then((data) => {
				// console.log(data);
				return data.json();
			})
			.then((object) => {
				// this fetch receives the service list
				fetch('http://localhost:3000/service')
					.then((serviceData) => {
						return serviceData.json();
					})
					.then((serviceObject) => {
						console.log(serviceObject);

						// this copies the graph and the inner array for copying
						const newGraph = Object.assign({}, this.state.graph);
						newGraph.nodes = this.state.graph.nodes.slice();
						newGraph.edges = this.state.graph.edges.slice();
						// this loop cycles through the service list and assigns them to their own boxes
						for (let i = 0; i < serviceObject.items.length; i+=1) {
							const newService = {};
							newService.id = i;
							newService.label = serviceObject.items[i].metadata.name;
							newService.selector = serviceObject.items[i].spec.selector;
							newGraph.nodes.push(newService);
						}
						// this loop cycles through the pod list and assigns them to their own boxes
						for (let i = 0; i < object.items.length; i+=1) { 
							const newObj = {};
							newObj.id = i + 10;
							newObj.label = object.items[i].metadata.name + '\n' + JSON.stringify(object.items[i].status.containerStatuses[0].state);
							newObj.labels = object.items[i].metadata.labels;
							if (typeof newGraph.nodes[i].selector === 'object') {
								const checkKey = Object.keys(newGraph.nodes[i].selector);
								for (let j = 0; j < newGraph.nodes.length; j+=1) {
									console.log(newGraph.nodes[j].selector)
									if (newGraph.nodes[j].selector && newGraph.nodes[j].selector[checkKey[0]] === newObj.labels[checkKey[0]]) {
										console.log('true');
										const newEdge = {
											from: newGraph.nodes[j].id,
											to: newObj.id
										};
										newGraph.edges.push(newEdge);
									}
								}
							}
							// console.log(checkKey[0])
							// console.log(newGraph.nodes[i].selector);
							// console.log(newGraph.nodes[i].selector[checkKey[0]]);
							// console.log(newObj.labels[checkKey[0]]);
							
							
							newGraph.nodes.push(newObj);
						}
						this.setState({
							graph: newGraph
						}) 
					
				})
			})
		
	}

	// handleClick() {
	// 	fetch('http://localhost:3000')
	// 	  .then((data) => {
	// 			console.log(data);
	// 			return data.json();
	// 		})
	// 		.then((object) => {
	// 			const newGraph = Object.assign({}, this.state.graph);
	// 			newGraph.nodes = this.state.graph.nodes.slice();

	// 			for(let i = 0; i<object.items.length; i+=1) { 
	// 				const newObj = {};
	// 				newObj.id = i
	// 				newObj.label = object.items[i].metadata.name;
	// 				newGraph.nodes.push(newObj);
	// 			}

	// 			this.setState({
	// 				graph: newGraph
	// 			}) 
	// 		})
	// }

	render() {
		console.log(this.state.graph);

		return (
		<div>
			<h1>Hello My Classy Friend</h1>
			{/* <button onClick={this.handleClick}>click me</button> */}
			<Graph graph={this.state.graph} options={options} events={events} />;
		</div>
		)
	}
}


export default App;