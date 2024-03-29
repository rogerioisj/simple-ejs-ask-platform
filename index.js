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

app.get("/question/:id", async (req, res) => {
    const id = req.params.id

    if (isNaN(id)) {
        res.redirect("/")
        return
    }

    const question = await prisma.question.findUnique({
        where: {
            id: +id
        },
        include: {
            answers: {
                orderBy: {
                    id: "desc"
                }
            }
        }
    })

    if (!question) {
        res.redirect("/")
        return
    }

    res.render("question", { question: question })
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

app.post("/answer/:id", async (req, res) => {
    const id = req.params.id
    const answer = req.body.answer

    if (isNaN(id)) {
        res.redirect("/")
        return
    }

    const question = await prisma.question.findUnique({
        where: {
            id: +id
        }
    })

    if (!question) {
        res.redirect("/")
        return
    }

    await prisma.answer.create({
        data: {
            text: answer,
            question: {
                connect: {
                    id: +id
                }
            }
        }
    })

    res.redirect("/question/" + id)
})

app.listen(3000, async () => {
    await dbConnect()
    console.log("Server running on port 3000")
})

