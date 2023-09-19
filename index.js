const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const PORT = process.env.PORT || 3001

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "039-123456"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "041-123456"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "042-123456"
    },
    
]

morgan.token('body', function (req, res) { return JSON.stringify(req.body) } )


app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (req, res) => {

    res.send('<h1>Hola Mundo</h1>')
})

app.get('/info', (req, res)=> {

    const date = new Date()
    
    const info = `<p>Phonebook has info for ${persons.length} people</p>
    <div> ${date}</div>`

    res.send(info)
})

app.get('/api/persons', (req, res) => {

    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    const person = persons.find((person) => person.id === id)

    if (person) {
        res.json(person)
        return
    }

    res.status(404).end()
    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)

    const person = persons.find(person => person.id === id)

    if (person) {
        persons = persons.filter((person) => person.id !== id) 

        res.status(204).end()
        return
    } else {
        res.status(404).json({message: 'id not found'}).end()
    }
    
    
})

app.post('/api/persons', (req, res) => {
    const {name, number} = req.body

    if (!name || !number) {
        return res.status(400).json({error: 'name or number are missing'})
    }

    const alreadyAdded = persons.find(person => person.name === name)

    if(alreadyAdded){
        return res.status(400).json({error: "name must be unique"})
    }

    const person = {
        id: Math.floor(Math.random()*10000 - 1),
        name,
        number
    }

    persons = persons.concat(person)

    res.status(200).json(person)
})





app.listen(PORT, ()  => {
    console.log(`Server running on port ${PORT}`)
})