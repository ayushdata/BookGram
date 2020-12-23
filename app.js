const express = require('express')
const app = express()
const mongoose = require('mongoose')
const { mongoURI } = require('./config/keys')
const PORT = process.env.PORT || 5000

// Creating Database Connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.connection.on('connected', () => {
    console.log("Database connection established")
})
mongoose.connection.on('error', (err) => {
    console.log("Error connecting to Database", err )
})

require("./models/user")
require("./models/post")

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

if (process.env.NODE_ENV == "production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

// Starting Server
app.listen(PORT, () => {
    console.log("Server is running on PORT: ", PORT);
})