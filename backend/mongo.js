const mongoose = require('mongoose')



const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://Magee:${password}@magee87.x9jtnre.mongodb.net/PhoneBookMongo?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const pbmongoSchema = new mongoose.Schema({
  name: String,
  number: String,
})




const Pack = mongoose.model('person', pbmongoSchema)

if (process.argv.length < 5) {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Phonebook:')
      Pack.find({})
        .then(people => {
          people.forEach(person => {
            console.log(person.name, person.number)
          })
          // console.log("Connection closed to Mongo");
          mongoose.connection.close()
          process.exit(1)
        })
    })

} else {


  const newperson = new Pack({
    name:name,
    number: number,
  })

  newperson.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook!`)
    mongoose.connection.close()
  })

}

