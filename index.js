require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook')

const app = express()

const PORT = process.env.PORT

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        name: "Ada Lovelace",
        number: "039-123456"
    },
    {
        name: "Dan Abramov",
        number: "041-123456"
    },
    {
        name: "Mary Poppendick",
        number: "042-123456"
    },
    
]

morgan.token('body', function (req, res) { return JSON.stringify(req.body) } )


app.use(express.json())
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (req, res)=> {

    const date = new Date()

    Phonebook.find({}).then(result => {

        const info = `<p>Phonebook has info for ${result.length} people</p>
    <div> ${date}</div>`

    res.send(info)
    })
    
    
})

app.get('/api/persons', (req, res) => {

    Phonebook.find({}).then(persons => {

        res.status(200).json(persons)
    }).catch(err =>
        console.log(err)
    )

    
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Phonebook.findById(id)
    .then(person => {
        if (person) {
           return res.json(person)
        }

        res.status(404).end()
    })  
    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id

    Phonebook.findByIdAndRemove(id)
        .then(person => {
            if (person) {
                return res.status(204).end()
                
            } else {
                res.status(404).json({message: 'id not found'}).end()
            }
        })

    
})

app.post('/api/persons', (req, res) => {

    const {name, number} = req.body

    if (!name || !number) {
        res.status(400).json({error: 'name or number are missing'})
        return
    }

    Phonebook.findOne({name: name}).then(result => {

        if (result) {
            res.status(400).json({error: "name must be unique"})
            return
        }

        const newPerson = {
            name,
            number
        }
    
        Phonebook.create(newPerson).then(result => {
            res.status(200).json(result)
        })
    })

    


})


app.listen(PORT, ()  => {
    console.log(`Server running on port ${PORT}`)
})