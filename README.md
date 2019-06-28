# spekt8
Visualize your Kubernetes cluster in real time - additions to play nice with arm32v7

This is a fork of [spekt8](https://github.com/spekt8/spekt8 "spekt8").
I highly recommend hitting up their [README.md](https://github.com/spekt8/spekt8/blob/master/README.md)

I'm running a cluster of Beaglebone Blacks, and the base image and some of the node dependencies don't play nice on my arch. 
You can pull the latest from [hanzov69/arm32v7-spekt8:latest](https://cloud.docker.com/repository/docker/hanzov69/arm32v7-spekt8/general "Docker Hub").

### Deployment
- kubectl apply -f [spekt8-deployment-armhf.yaml](https://github.com/hanzov69/spekt8/blob/master/spekt8-deployment-armhf.yaml)
- kubectl port-forward deployment/spekt8 3000:3000

In addition, in order to allow reading resources of the API, you must configure a set of permissions. We have set up a YAML file using RBAC authorization which you can apply directly to your Kubernetes cluster using the command line:
* kubectl apply -f [fabric8-rbac.yaml](https://raw.githubusercontent.com/hanzov69/spekt8/master/fabric8-rbac.yaml).

Then, open your web browser to [http://localhost:3000](http://localhost:3000).
