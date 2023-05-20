
const mongoose = require('mongoose')

console.log('Element.js helloouuu Vieetnaaam')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)


mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const pbmongoSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: function (value) {
        const regex = /^\d{2,3}-\d+$/
        return regex.test(value)
      },
      message: 'Invalid phone number format, need to use 2-3 numbers - numbers example: 040-12312333'
    }
  }
})

pbmongoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('person', pbmongoSchema)


