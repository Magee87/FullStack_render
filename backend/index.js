const express = require('express');
const app = express();
const morgan = require('morgan');
//const fs = require('fs');
const cors = require('cors');
require('dotenv').config()


const Pack = require('./models/element')




// Connect to MongoDB using element.js
require('./models/element');



/*
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
*/
startServer();


function startServer() {
  app.use(express.json());
  app.use(cors());
  app.use(express.static('build'))

// MORGAN PART
  morgan.token('content', (req, res) => {
    return JSON.stringify(req.body);
  });


// REST
app.get('/info', (req, res) => {
  Pack.countDocuments({})
    .then(count => {
      const info = `Phonebook has info for ${count} people.`;
      const currentTime = new Date();
      const infoboard = `${info}<br><b>Current time:</b> ${currentTime} `;
      res.send(infoboard);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Server error INFO' });
    });
});

  app.get('/api/persons', (req, res) => {

    
  Pack.find()
  .then(data => {
    res.json(data);
  })
  .catch(error => {
    console.error(error);
  });

  });

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    
    Pack.findById(id)
      .then(person => {
        if (person) {
          response.json(person);
        } else {
          response.status(404).send('<h1>404 Not Found</h1><p>Please check the ID number again.</p><img src="https://picsum.photos/500/300">');
        }
      })
      .catch(error => {
        console.error(error);
        response.status(500).send('<h1>Internal Server Error 500</h1></p><img src="https://picsum.photos/500/300">');
      });
  });

  app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
  
    Pack.findByIdAndRemove(id)
      .then(() => {
        response.status(204).end();
      })
      .catch(error => {
        console.error(error);
        response.status(500).json({ error: 'Server error' });
      });
  });

/*
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
*/

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Pack({
    name: body.name,
    number: body.number || "no number added",
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})




const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
}
