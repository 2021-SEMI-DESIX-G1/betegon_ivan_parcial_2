const express = require('express');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const Data = [

]

var Tasks = {

    getTasks: (req, res) => {

        res.json({
            model: 'Tasks',
            count: Data.length,
            data: Data,
        });

    },

    getTask: (req, res) => {

        res.json(Data[req.params.id]);

    },

    createTask: (req, res) => {
  
        var { task, category } = req.body;
        
        var id = Math.floor(Math.random() * 10000) + 1;

        status = '';

        Data.push({ id, task, category, status });
        
        res.json({
            model: 'Tasks',
            data: Data[id],
        });
    },

    deleteTask: (req, res) => {

        console.log("Vaaaaa!")
        console.log(Data);
        var { id } = req.body;
        console.log(id);
        
        var index = Data.findIndex(obj => obj.id==String(id));
        console.log(index);
        Data.splice(index, 1);
        console.log(Data);


        res.json({
            model: 'Tasks',
            data: Data,
        });

    },

    updateTask: (req, res) => {

        var index = Data.findIndex(obj => obj.id==String(req.body.id));

        var { task, category } = req.body;

        Data[index].task = task;
        Data[index].category = category;
        
        res.json({
            model: 'Tasks',
            data: Data,
        });

    },

    updateCheck: (req, res) => {

        var index = Data.findIndex(obj => obj.id==String(req.body.id));

        var { id, status } = req.body;

        console.log(id);
        console.log(status);
        console.log(index);

        Data[index].status = status;

        console.log(Data);

        res.json({
            model: 'Tasks',
            data: Data,
        });

    },


}

app.get('/api/v1/tasks/', Tasks.getTasks);
app.post('/api/v1/tasks/', Tasks.createTask);
app.delete('/api/v1/tasks/:id', Tasks.deleteTask);
app.patch('/api/v1/tasks/:id', Tasks.updateCheck);
app.put('/api/v1/tasks/:id', Tasks.updateTask);


//app.post('/api/v1/tasks/', TasksValidations.createUser, Tasks.createUser);
// 
// 
// app.delete('/api/v1/Tasks/:id', Tasks.getUser);

app.listen(port, () => {
    console.log(`Escuchando en: http://localhost:${port}`)
})