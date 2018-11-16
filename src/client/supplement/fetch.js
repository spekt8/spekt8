
const fetchData = (nodes, edges, graph, that) => {
	// this fetch receives the pod list
	fetch('http://localhost:3000/api/pod')
	.then((podData) => {
		// console.log(data);
		return podData.json();
	})
	.then((podObject) => {
		// this fetch receives the service list
		fetch('http://localhost:3000/api/service')
			.then((serviceData) => {
				return serviceData.json();
			})
			.then((serviceObject) => {
				console.log('serviceobject',serviceObject);
				fetch('http://localhost:3000/api/ingress')
					.then((ingressData) => {
						return ingressData.json();
					})
					.then((ingressObject) => {
						console.log('ingressobject',ingressObject);
						// this creates a copy of the state 
						const newGraph = Object.assign({}, graph);
						newGraph.nodes = nodes.slice();
						newGraph.edges = edges.slice();
						
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
							newPodObject.id = i + 1000;
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
							newIngressObject.id = i + 2000;
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
						console.log('newgraph',newGraph)
						// return new Promise((resolve, reject) => {
						// 	resolve('hey')
						// })
			
						that.setState({
							graph: newGraph
						}) 
					})				
			})
	})
}

export default fetchData;
