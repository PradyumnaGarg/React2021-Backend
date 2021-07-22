const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const PORT = process.env.PORT || 2000;


app.use(express.json())
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

const persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

app.get('/api/persons', (req, res, next) => {
    res.status(200);
    res.json(persons);
})

app.get('/api/info', (req, res) => {
    const personsLength = persons.length;
    const date = new Date().toString();

    res.send(`<p>Phonebook has info of ${personsLength} people</p> <p>${date}</p>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({error: 'Record not found'})
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const personIndex = persons.findIndex(person => person.id === id);
  if (personIndex > -1) {
    persons.splice(personIndex, 1);
    res.status(204).json({resp: 'No Content'})
  } else {
    res.status(404).json({error: 'Record not found'})
  }
})

app.post('/api/persons', (req, res) => {
  if (!req.body.name || !req.body.number) {
    res.status(401).json({error: 'No sufficient data provided'})
    return;
  }

  const personIndex = persons.findIndex(person => person.name === req.body.name);

  if (personIndex > -1) {
    res.status(401).json({error: 'Name already exist'})
    return;
  }

  const person = {
    id: Math.floor(10000 + (Math.random() * 90000)),
    name: req.body.name,
    number: req.body.number
  }

  persons.push(person);
  res.status(201).json(person);
})

app.listen(PORT, () => {
    console.log(`Server is listening at ${PORT}`);
})