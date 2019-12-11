require('dotenv').config()
const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const name = process.argv[3]
const num = process.argv[4]

const url = `mongodb+srv://FullStackOpenUser:${password}@cluster0-rwwir.mongodb.net/test?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true })

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Note = mongoose.model('Note', noteSchema)

if(name && num){
    const note = new Note({
    name: name,
    number: num,
    id: Math.floor(Math.random()*200)
    })

    note.save().then(response => {
    console.log(`Added ${note.name} number ${note.number} to phonebook`);
    mongoose.connection.close();
    })
}
else{
    Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })

}


module.exports = mongoose.model('Note', noteSchema)