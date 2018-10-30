// require statements
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// k8s javascript client require
const k8s = require('@kubernetes/client-node');
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.Core_v1Api);

// use statements
app.use(bodyParser.json());

app.get('/', (req, res) => {
  k8sApi.listNamespacedPod('default')
    .then((re) => {
      // console.log(re.body);
      // console.log('container information: ', re.body.items[0].spec.containers);
      // console.log(JSON.stringify(re.body, null, 2));
      // for (let i = 0; i < re.body.items.length; i += 1) {
      //   console.log(re.body.items[i].spec.containers);
      // }
      
      res.send(JSON.stringify(re.body, null, 2));
    });
  
});


// server listening
app.listen(8080, (err) => {
  if (err) console.log(err);
  else console.log('Listening on port 8080....');
});
