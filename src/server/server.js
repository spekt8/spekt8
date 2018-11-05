// require statements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// k8s javascript client require
const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.Core_v1Api);
const k8sApi2 = kc.makeApiClient(k8s.Extensions_v1beta1Api);

// use statements
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  k8sApi.listNamespacedPod('default')
    .then((re) => {
      // console.log(re.body);
      // console.log('container information: ', re.body.items[0].spec.containers);
      // console.log(JSON.stringify(re.body, null, 2));
      // for (let i = 0; i < re.body.items.length; i += 1) {
      //   console.log(re.body.items[i].spec.containers);
      // }
      res.json(re.body);
    });
});

app.get('/service', (req, res) => {
  k8sApi.listNamespacedService('default')
    .then((re) => {
      res.json(re.body);
    });
});

app.get('/ingress', (req, res) => {
  k8sApi2.listNamespacedIngress('default')
    .then((re) => {
      res.json(re.body);
    });
});

app.get('/deployment', (req, res) => {
  k8sApi2.listNamespacedDeployment('default')
    .then((re) => {
      res.json(re.body);
    });
});

// server listening
app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log('Listening on port 3000....');
});
