const app = require('./express-app')

app.listen(3000, (err) => {
  if (err) console.log(err);
  else console.log('Listening on port 3000....');
});

