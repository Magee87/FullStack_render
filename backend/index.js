const express = require('express')
const app = express()
const morgan = require('morgan')
//const fs = require('fs');
const cors = require('cors')
require('dotenv').config()


const Pack = require('./models/element')




// Connect to MongoDB using element.js
require('./models/element')



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




app.use(express.json())
app.use(cors())
app.use(express.static('build'))




// MORGAN PART
morgan.token('content', (req, res) => {
  console.log(res.statusCode)
  return JSON.stringify(req.body)
})


// REST
app.get('/info', (req, res) => {
  Pack.countDocuments({})
    .then(count => {
      const info = `Phonebook has info for ${count} people.`
      const currentTime = new Date()
      const infoboard = `${info}<br><b>Current time:</b> ${currentTime} `
      res.send(infoboard)
    })
    .catch(error => {
      console.error(error)
      res.status(500).json({ error: 'Server error INFO' })
    })
})

app.get('/api/persons', (req, res) => {


  Pack.find()
    .then(data => {
      res.json(data)
    })
    .catch(error => {
      console.error(error)
    })

})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Pack.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        const err = new Error('Person not found')
        err.status = 404
        throw err
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
  const id = request.params.id

  Pack.findByIdAndRemove(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log('body.name')
  console.log(body.name)
  if (body.name === undefined || body.name === '' ) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Pack({
    name: body.name,
    number: body.number || 'no number added',
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Pack.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedperson => {
      response.json(updatedperson)
    })
    .catch(error => next(error))
})


app.use(errorHandler)

// ERROR HANDLERI
function errorHandler(error, response) {
  console.error(error.name)
  console.error(error.message)
  //console.log("ERRROR NAME EEEERROROROROrO")
  //console.log(err.name);

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'CastError') {
    return response.status(400).send('<h1>400 Bad Request</h1><p>Invalid ID format.</p><img style="width: 100%;" src="https://picsum.photos/1200/600">')
  }

  if (error.status === 404) {
    return response.status(404).send('<h1>404 Not Found</h1><img src="https://picsum.photos/500/300">')
  }

  return response.status(500).send({ error: '<h1>Server Error</h1><img style="width: 100%;" src="https://picsum.photos/1200/600">' })
}


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

