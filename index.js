const express = require("express")
const app = express()
const path = require("path")
const bp = require("body-parser")
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(express.static(path.join(__dirname, "node_modules/bootstrap/dist/")))
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

const dbConnect = async () => {
    await prisma.$connect()
    console.log("Connected to database")
}

let questions = []

app.get("/", async (req, res) => {
    questions = await prisma.question.findMany();
    res.render("index", { questions: questions })
})

app.get("/ask", async (req, res) => {
    res.render("ask-form")
})

app.post("/ask", async (req, res) => {
    questions.push({
        title: req.body.title,
        description: req.body.description
    })

    await prisma.question.create({
        data: {
            title: req.body.title,
            description: req.body.description
        }
    })

    res.redirect("/")
})

app.listen(3000, async () => {
    await dbConnect()
    console.log("Server running on port 3000")
})

