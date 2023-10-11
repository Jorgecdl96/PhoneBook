const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const URI = process.env.URI

mongoose.connect(URI)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const phonebookSchema = new mongoose.Schema({
    name: {
        type: String, 
        unique: true, 
        required: true,
        minlength: 3
    },
    number: {
        type: String, 
        unique: true, 
        required: true,
        minlength: 8
    }
})

phonebookSchema.plugin(uniqueValidator)

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

module.exports = Phonebook