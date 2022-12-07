const express = require('express');

const http = require('http');
const cors = require('cors');
const fetch = require('node-fetch');
const port = 4000

const { URLSearchParams } = require('url');

const encodedParams = new URLSearchParams();

const app = express();
app.use(cors());
app.use(express.json())



app.post('/token', (req, res) => {
  console.log(req.body);
  encodedParams.set('email', req.body.email);
  encodedParams.set('password', req.body.password);

  let url = 'https://housing-api.stag.mpao.mv/auth/signin';

  let options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: encodedParams
  };

  fetch(url, options)
    .then(resp => resp.json())
    .then(json => res.json(json))
    .catch(err => console.error('error:' + err));
})

app.listen(port, () => {
  console.log(`Cat API listening on port ${port}`)
})