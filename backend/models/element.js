
const mongoose = require('mongoose')

console.log("Element.js helloouuu Vieetnaaam")
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)


mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const pbmongoSchema = new mongoose.Schema({
  name: String,
  number: String,
})

pbmongoSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


module.exports = mongoose.model('person', pbmongoSchema)


