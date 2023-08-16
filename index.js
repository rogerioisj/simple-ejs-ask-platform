const express = require("express")
const app = express()
const path = require("path")
const bp = require("body-parser")

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")))
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

const questions = []

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/ask", (req, res) => {
    res.render("ask-form")
})

app.post("/ask", (req, res) => {
    questions.push({
        title: req.body.title,
        description: req.body.description
    })

    console.log(questions)

    res.redirect("/ask/")
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})

