const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db/index.js');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

app.get('/products/search', (request, response)=>
{
  //console.log(request.query.limit)
  //response.send({'ack': true});
  
  console.log(typeof request.query.limit)
  console.log(typeof request.query.brand)
  console.log(typeof parseInt(request.query.price))
  db.productSearch(request.query.limit, request.query.brand, parseInt(request.query.price)).then(res=>console.log(res))
  db.productSearch(request.query.limit, request.query.brand, parseInt(request.query.price)).then(res=>response.send(res))
}
)

app.get('/products/:id', (request, response) => 
{
  //console.log(request.params.id)
  //console.log(db.idSearch(request.params.id))
  db.idSearch(request.params.id).then(res=>response.send(res))
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);
