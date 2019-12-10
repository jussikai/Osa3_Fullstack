const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

morgan.token('content', function getBody(req,res) {
  if(req.method === 'POST'){
  return(JSON.stringify(req.body))}
  return null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))




let notes = [
    {name: "Arto Hellas",
    number: "040-123456",
    id: 1},
    {name: "Ada Lovelace",
    number: "22331123",
    id: 2},
    {name: "Dan Abramov",
    number: "040-1222445",
    id: 3},
    {name: "Mary Poppendieck",
    number: "040-22226",
    id: 4}
]


app.get('/', (req, res) => {
  return res.send('Hello World')
  })
  
app.get('/api/persons', (req, res) => {
    res.json(notes)
})

app.post('/api/persons', (request, response) => {
    const Id = Math.floor(Math.random()*100)
    
    const note = request.body
    note.id = Id
    if (!note.name || !note.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    } 
    else if (notes.find(oldnote => oldnote.name === note.name))  {
      return response.status(400).json({ 
        error: 'name must be unique' 
      })
    } 

    notes = notes.concat(note)
    
    response.json(note)
    })

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })
  

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })


app.get('/info', (req, res) => {
    console.log("moi")
    count = notes.length
    res.send('<div>Phonebook has info of '+ count + '</div>' + '<div>' + Date() + '</div>')
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})