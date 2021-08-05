const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT || 2000;
const db = require('./mongo');
const mongoose = require('mongoose');

app.use(express.json())
app.use(express.static('build'))
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}));
app.use(cors())

const personSchema = new mongoose.Schema({
  name: String,
  number: Number
})

const Person = new mongoose.model('person', personSchema);

app.get('/api/persons', (req, res, next) => {
  Person.find({})
  .then((persons) => {
    res.status(200);
    res.json(persons);
  })
  .catch((error) => next(error));
})

app.get('/api/info', (req, res) => {
    Person
    .find({})
    .count()
    .then((count) => {
      const date = new Date().toString();
      res.send(`<p>Phonebook has info of ${count} people</p> <p>${date}</p>`)
    })
    .catch((error) => next(error));

})

app.get('/api/persons/:id', (req, res, next) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  Person.findOne({_id: id})
  .then((person) => {
    if (person) {
      res.json(person);
    } else {
      next({name: 'NotFound'})
    }
  })
  .catch((error) => {
    next(error);
  });
})

app.put('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
  .then((updatedPerson) => {
    res.status(200).json(updatedPerson);
  })
  .catch((error) => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then((result) => {
    console.log('Delete Result', result)
    if(result) {
      res.status(204).json({resp: 'No Content'});
    } else {
      next({name: 'NotFound'});
    }
  })
  .catch((error) => {
    next(error);
  })
})

app.post('/api/persons', (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    res.status(400).json({error: 'No sufficient data provided'})
    return;
  }

  Person.findOne({name: req.body.name})
  .then((person) => {
    if(person) {
      res.status(400).json({error: 'Name already exist'})
      return;
    }

    Person.create({name: req.body.name, number: req.body.number})
    .then((person) => {
      res.status(201).json(person);
    })
    .catch((error) => next(error))
  })
  .catch((error) => next(error));
})

const errorHandler = (error, request, response, next) => {
  console.log(error.name);
  if (error.name === 'CastError') {
    return response.status(400).json({error: '_id Malformed'});
  } else if (error.name === 'NotFound') {
    return response.status(404).json({error: 'Record not found'});
  } else {
    return response.status(500).json({error: error.message});
  }
}

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
})