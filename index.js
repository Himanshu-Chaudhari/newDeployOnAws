const express=require('express')
const bodyParser=require('body-parser')
const fs=require('fs')
const cors=require('cors')
const port=3000
const app=express()


app.use(cors())
app.use(bodyParser.json())

let url = "/Users/himanshuchaudhari/Desktop/code/HarkiratSingh/ExpressProjects/ToDoAppUsingFS/db.json"

let addToTodoList=(req,res)=>{
    // const paarsedResponse=validTodo.safeParse(req.body);
    // if(!paarsedResponse.success){
    //     res.status(411).send(paarsedResponse.error)
    // }
    toAdd={
        "id":req.body.id,
        "title":req.body.title,
        "discription":req.body.discription,
        "completed":req.body.completed
    }
    fs.readFile(url,'utf8',(err,data)=>{
        if(err){
            throw err;
        }
        let d=JSON.parse(data)
        d.push(toAdd)
        fs.writeFile(url,JSON.stringify(d),(err)=>{
            if(err){
                throw err;
            }
        })
    })
    res.send(`Task added with id :${req.body.id}`)
}

let returnAllToDo=(req, res)=>{
    fs.readFile(url,'utf-8',(err,data)=>{
        if(err) throw err
        res.json(JSON.parse(data))
        }
    )
}

let returnSpecificToDo=(req,res)=>{
    let id=parseInt(req.params.id)
    fs.readFile(url,(err,data)=>{
        if(err){
            res.send(JSON.stringify(err))
        }
        newData=JSON.parse(data)
        let toReturn = newData.find((ele)=>{
            return ele.id==id })
        res.send(toReturn)
    })
}

let updateToDo=(req,res)=>{
    let id=req.params.id
    toAdd={
        "id":parseInt(id),
        "title":req.body.title,
        "discription":req.body.discription,
        "completed":req.body.completed
    }
    fs.readFile(url,(err,data)=>{
        if(err){
            res.send(JSON.stringify(err))
        }
        data=JSON.parse(data)
        // console.log(newData)
        newData=data.map((ele)=>{
            if(ele.id==id){
                return toAdd
            }
            else{
                return ele
            }
        })
        fs.writeFile(url,JSON.stringify(newData),(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send('Updated')
            }
        })
    })
}

let deleteToDo=(req,res)=>{
    let id=req.params.id
    toAdd={
        "id":id,
        "title":req.body.title,
        "discription":req.body.discription,
        "completed":req.body.completed
    }
    fs.readFile(url,(err,data)=>{
        if(err){
            res.send(JSON.stringify(err))
        }
        data=JSON.parse(data)
        newData=data.filter((ele)=>{
            return ele.id!=id
        })
        fs.writeFile(url,JSON.stringify(newData),(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send('Deleted')
            }
        })
    })
}

app.get('/hello',(req,res)=>{
    res.send("Welcome to to-do app")
})

app.get('/todos',returnAllToDo)

app.get('/todos/:id',returnSpecificToDo)

app.post('/todos',addToTodoList)

app.put('/todos/:id',updateToDo)

app.delete('/todos/:id',deleteToDo)

const started=()=>{
    console.log('App started')
}

app.listen(port,started)

