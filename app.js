const express = require('express');

const app = express();
const morgan = require('morgan');
const cors = require('cors');
const personsRouter = require('./components/persons/persons.router');
require('./mongo');

app.use(express.json());
app.use(express.static('build'));
app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  tokens.url(req, res),
  tokens.status(req, res),
  tokens.res(req, res, 'content-length'),
  '-',
  tokens['response-time'](req, res),
  'ms',
  JSON.stringify(req.body),
].join(' ')));
app.use(cors());

app.use('/api/persons', personsRouter);

const errorHandler = (error, request, response) => {
  if (error.name === 'CastError') {
    return response.status(400).json({ error: '_id Malformed' });
  }
  if (error.name === 'NotFound') {
    return response.status(404).json({ error: 'Record not found' });
  }
  return response.status(500).json({ error: error.message });
};

app.use(errorHandler);

module.exports = app;
