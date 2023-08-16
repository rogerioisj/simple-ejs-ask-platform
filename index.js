const express = require("express")
const app = express()
const path = require("path")

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/ask", (req, res) => {
    res.render("ask-form")
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})

