require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const {engine} = require('express-handlebars')
const path = require('path')
// const methodOverride = require('method-override')

// - Middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(methodOverride('_method'))  // for DELETE/UPDATE method form

// - Handlebars
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: "main"}));
app.set('view engine','hbs')
app.set('views',path.join(__dirname,'../client/views'))

// - Static
app.use(express.static(path.join(__dirname,'../client/public')))


app.get('/createDatabase',(req,res)=>{
    let model = require('./database/models')
    model.sequelize.sync().then(()=>{
        res.send("create database tickettakeit successful")
    })
})
app.use('/',require('./routes/viewRouter'))






app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`))