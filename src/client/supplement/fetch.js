const fetchData = (nodes, edges, graph, that) => {
	
	return new Promise((resolve, reject) => {
		const p1 = fetch('/pod');
		const p2 = fetch('/service');
		const p3 = fetch('/ingress');
		const p4 = fetch('/daemonset')

		// Waits for all the fetch to resolve
		Promise.all([p1, p2, p3, p4])
		.then((values) => {
			Promise.all(values.map(ele => ele.json()))
			.then((objectValues) => {
				
				// all the objects exist in here
				const podObject = objectValues[0];
				const serviceObject = objectValues[1];
				const ingressObject = objectValues[2];
				const daemonsetObject = objectValues[3];

				// console.log('podobject', podObject);
				// console.log('ingressobject', ingressObject);
				// console.log('serviceobject', serviceObject);
				// console.log('daemonsetobject', daemonsetObject);
				
				// this creates a copy of the state 
				const newGraph = Object.assign({}, graph);
				newGraph.nodes = nodes.slice();
				newGraph.edges = edges.slice();
				
				// place service list and pod list into separate variables
				const serviceArray = [];
				const podArray = [];
				const ingressArray = [];
				const daemonsetArray = [];
			
				

				/* SERVICES */
				// this loop cycles through the service list and assigns them to their own boxes
				for (let i = 0; i < serviceObject.items.length; i+=1) {
					const newServiceObject = {};
					// saving service object information
					newServiceObject.id = i + 1000;
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
					// group-name
					newServiceObject.group = 'services';
					// filter hidden
					newServiceObject.hidden = true;
					newGraph.nodes.push(newServiceObject);
					serviceArray.push(newServiceObject);
				}


				/* PODS */
				// this loop cycles through the pod list and assigns them to their own boxes
				for (let i = 0; i < podObject.items.length; i+=1) { 
					const newPodObject = {};
					newPodObject.id = i + 2000;
					newPodObject.kind = "Pod";
					newPodObject.label = 'Pods'; // pod display title
					// pending versus running pods
					if (podObject.items[i].status.phase === "Pending") {
						newPodObject.color = "yellow";
					}
					// loop through containers object
					for (let j = 0; j < podObject.items[i].spec.containers.length; j+=1) {
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
					// group-name
					newPodObject.group = 'pods';
					// filter hidden
					newPodObject.hidden = true;
					newGraph.nodes.push(newPodObject);
					podArray.push(newPodObject);
				}

				/* INGRESS */
				// this loops through the ingress object and saves to another array
				for (let i = 0; i < ingressObject.items.length; i+=1) {
					const newIngressObject = {};
					newIngressObject.id = i + 3000;
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
					newIngressObject.group = "ingress";
					// filter hidden
					newIngressObject.hidden = true;
					newGraph.nodes.push(newIngressObject);
					ingressArray.push(newIngressObject);
				}

				/* DAEMONSET */
				// for (let i = 0; i < daemonsetObject.items.length; i += 1) {
				// 	const newDaemonSetObject = {};
				// 	newDaemonSetObject.id = i + 4000;
				// 	newDaemonSetObject.kind = "DaemonSet";
				// 	newDaemonSetObject.label = "DaemonSet";
				// 	newDaemonSetObject.timeStamp = daemonsetObject.items[i].metadata.creationTimestamp;
				// 	newDaemonSetObject.name = daemonsetObject.items[i].metadata.name;
				// 	newDaemonSetObject.namespace = daemonsetObject.items[i].metadata.namespace;
				// 	// looping through containers
				// 	let containersPath = daemonsetObject.items[i].spec.template.spec.containers; // this is containers array
				// 	newDaemonSetObject.containers = [];
				// 	for (let j = 0; j < containersPath.length; j += 1) {
				// 		const containerObj = {};
				// 		containerObj.name = containersPath[j].name;
				// 		containerObj.image = containersPath[j].image;
				// 		newDaemonSetObject.containers.push(containerObj);
				// 	}
				// 	// design the ingress node
				// 	newDaemonSetObject.shape = "diamond";
				// 	newDaemonSetObject.color = "teal";
				// 	newDaemonSetObject.group = "daemonset";
				// 	newGraph.nodes.push(newDaemonSetObject);
				// 	daemonsetArray.push(newDaemonSetObject);
				// }

				/* SERVICE - POD CONNECTIONS */
				// this checks whether the selector from the service object matches the labels from the pods object
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
				
				/* INGRESS - SERVICE CONNECTIONS */
				// this checks whether the service is listed in an ingress object

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

				// console.log('podarray', podArray);
				// console.log('ingressarray', ingressArray);
				// console.log('servicearray', serviceArray);
				// console.log('daemonsetarray', daemonsetArray);
				// console.log('newGraph', newGraph)

				newGraph.nodes.push(
					{ id: 1, label: 'kube-controller-manger', group: 'master' },
					{ id: 2, label: 'etcd', group: 'master' },
					{ id: 3, label: 'kube-scheduler', group: 'master' },
					{ id: 4, label: 'kube-apiserver', group: 'master' }
				)

				newGraph.edges.push(
					{ from: 1, to: 4 },
					{ from: 2, to: 4 },
					{ from: 3, to: 4 },
				)

				that.setState({
					graph: newGraph
				})
				resolve();
			});
		});
	})
}

export default fetchData;

