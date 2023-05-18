const express = require('express');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const cors = require('cors');

let persons = [];

fs.readFile('db.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON:', err);
    return;
  }

  try {
    const parsedData = JSON.parse(data);
    persons = parsedData.persons;
    startServer();
  } catch (parseErr) {
    console.error('Error parsing JSON:', parseErr);
  }
});

function startServer() {
  app.use(express.json());
  app.use(cors());
  app.use(express.static('build'))

  morgan.token('content', (req, res) => {
    return JSON.stringify(req.body);
  });

  app.get('/info', (req, res) => {
    const info = `Phonebook has info for ${persons.length} people.`;
    const currentTime = new Date();
    const infoboard = `${info}<br><b>Current time:</b> ${currentTime} `;

    res.send(infoboard);
  });

  app.get('/api/persons', (req, res) => {
    res.json(persons);
  });

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);
  
    if (person) {
      response.json(person);
    } else {
      response.status(404).send('<h1>404 Not Found</h1><p>Please check id number again what u were looking</p><img src="https://picsum.photos/500/300">');
    }
  });

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
  });

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0;
    return maxId + 1;
  };

  app.post('/api/persons', (request, response) => {
    const body = request.body;
    const nameExist = persons.find(person => person.name === body.name);
    if (nameExist) {
      return response.status(400).json({ 
        error: 'Name is already in the phonebook' 
      });
    }

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'Name or number is missing' 
      });
    }

    const person = {
      name: body.name,
      number: body.number || "no number added",
      id: generateId(),
    };

    persons = persons.concat(person);

    response.json(person);
  });

  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
