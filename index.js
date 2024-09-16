const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const port = 8080

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (err, data) => {
            if (err) {
                console.error(err)
                return;
            }

            const tasks = JSON.parse(data)
            resolve(tasks)
        })
    })
}

app.get('/', (req, res) => {
    readFile("./tasks.json")
        .then(tasks => {
            res.render('index', { tasks: tasks, error: null })
        })
})

app.post("/", (req, res) => {
    let error = null
    if (req.body.task === "") {
        error = "Please insert correct task data"
        readFile("./tasks.json")
            .then(tasks => {
                res.render('index', { tasks: tasks, error: error })
            })
    } else {
        readFile("./tasks.json")
            .then(tasks => {
                const newTask = {
                    "id": crypto.randomUUID(),
                    "task": req.body.task
                }

                tasks.push(newTask)
                const data = JSON.stringify(tasks, null, 2)
                fs.writeFile('./tasks.json', data, err => {
                    if (err) {
                        console.log(err)
                        return;
                    } else {
                        console.log("saved")
                    }

                    res.redirect('/')
                })
            })
    }
})

app.get("/delete-task/:taskId", (req, res) => {
    let deletedTaskId = req.params.taskId
    readFile('./tasks.json')
        .then(tasks => {
            tasks.forEach((task, index) => {
                if (task.id === deletedTaskId) {
                    tasks.splice(index, 1)
                }
            });
            data = JSON.stringify(tasks, null, 2)
            fs.writeFile('./tasks.json', data, "utf-8", err => {
                if (err) {
                    console.log(err)
                    return;
                }

                res.redirect("/")
            })
        })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})