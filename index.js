const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")

const AskModel = require("./database/Ask")

connection
  .authenticate()
  .then(() => {
    console.log('DB success')
  })
  .catch((error) => {
    console.log('DbError: ', error)
  })

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/ask", (req, res) => {
  res.render("ask")
})

app.post("/saveask", (req, res) => {
  const {
    title,
    description
  } = req.body

  AskModel.create({
    title,
    description
  }).then(() => {
    res.redirect("/")
  })
})

app.listen(8080, () => {
  console.log("App running...")
})