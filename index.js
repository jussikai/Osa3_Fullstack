require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Note = require('./models/note')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())


morgan.token('content', function getBody(req,res) {
    if(req.method === 'POST'){
    return(JSON.stringify(req.body))}
    return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


app.get('/api/persons', (req, res) => {
    console.log('getting')
    Note.find({}).then(notes => {
      res.json(notes)
    })
})

app.post('/api/persons', (request, response,next) => {
    
    const note = new Note({
      name: request.body.name,
      number: request.body.number
    })

    note.save().then(savedNote => {
      response.json(savedNote.toJSON())
      console.log('saved')
    })
    .catch(error => next(error))

    })

app.get('/api/persons/:id', (request, response, next) => {
    Note.findById(request.params.id)
      .then(note => {
        if (note) {
          response.json(note.toJSON())
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })
  
  

app.delete('/api/persons/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const note = {
    name: request.body.name,
    number: request.body.number
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
    console.log("moi")
    count = Note.countDocuments({}).exec((err,count)=>{
      res.send('<div>Phonebook has info of '+ count + '</div>' + '<div>' + Date() + '</div>')
    })
    
})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



const errorHandler = (error, request, response, next) => {
  //console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)