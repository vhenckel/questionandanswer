const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")

const AskModel = require("./database/Ask")
const AnswerModel = require("./database/Answer")

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
  AskModel
    .findAll({
      raw: true,
      order: [
        ['id', 'DESC']
      ]
    })
    .then(asks => {
      res.render("index", {
        asks
      })
    })
})

app.get("/ask", (req, res) => {
  res.render("ask")
})

app.get("/answer/:id", (req, res) => {
  const {
    id
  } = req.params
  AskModel
    .findOne({
      where: {
        id
      }
    })
    .then(ask => {
      if (!ask || ask === undefined) res.redirect("/")
      AnswerModel.findAll({
        where: {
          askId: ask.id
        },
        order: [
          ['id', 'DESC']
        ]
      }).then(answers => {
        res.render("answer", {
          ask,
          answers
        })
      })

    })
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

app.post("/saveanswer", (req, res) => {
  const {
    body,
    askId
  } = req.body

  AnswerModel.create({
    body,
    askId
  }).then(() => {
    res.redirect(`/answer/${askId}`)
  })
})

app.listen(8080, () => {
  console.log("App running...")
})