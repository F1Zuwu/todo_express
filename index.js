const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const port = 8080

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended: true}))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, "utf8", (err, data) => {
            if (err) {
                console.error(err)
                return;
            }

            console.log(data)

            const tasks = JSON.parse(data)
            resolve(tasks)
        })
    })
}

app.get('/', (req, res) => {
    readFile("./tasks.json")
        .then(tasks => {
            res.render('index', { tasks: tasks })
        })
})

app.post("/", (req, res) => {
    readFile("./tasks.json")
        .then(tasks => {

            console.log(tasks[tasks.lenght - 1])

            let index = null

            if (tasks.lenght === 0) {
                index = 0
            } else {
                index = tasks[tasks.lenght - 1].id + 1;
            }

            const newTask = {
                "id" : index,
                "task": req.body.tasks
            }

            console.log(newTask)

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
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})