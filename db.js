var express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

app.use(express.static('public')); 
app.use(bodyParser.json()); 

mongoose.connect("mongodb://localhost/jobportal");

var userSchema = new mongoose.Schema({
    "Username":String,
    "Password":String,
    "Email":String,
    "Phone":Number,
    "Location":String,
    "RadioValue":String
})
var jobSchema = new mongoose.Schema({
    "title":String,
    "description":String,
    "keywords":[String],
    "location":String
})
var loggedIn = new mongoose.Schema({
    "Username":String,
    "UserType":String
})

var users = mongoose.model('user',userSchema), 
    jobs = mongoose.model('job',jobSchema),
    loggedIn = mongoose.model('loggedIn', loggedIn)

app.post('/register', function(req,res){
   // console.log(req.body)
    users.create(req.body, function(err,data){
        if(!err){
            res.send({"flag":"success"})
        }
    })
})

app.post('/login', function(req,res){
    users.findOne({"Username": req.body.Username, "Password":req.body.Password}, function(err,data){
        if(!err){
            loggedIn.create({"Username": data.Username, "UserType": data.RadioValue}, function(err,data){
                if(!err){
                    res.send({"flag":"success"}) 

                }
            })
        }
    })
})

app.get('/loggedIn', function(req,res){
    loggedIn.findOne({}, function(err,data){
        if(!err){
          //  console.log(data)
            res.send(data)
        }
        else{
            console.log(err)
        }
    })
})
app.post('/postjob', function(req,res){
    jobs.create(req.body, function(err,data){
        if(!err){
            res.send({"flag":"success"})
        }
    })
})
app.get('/postjob', function(req,res){
    jobs.find({}, function(err,data){
    if(!err){
        res.send(data)
    }
    })
})


app.get('/postjob/:searchTitle/:searchDesc/:searchKey/:searchLoc', function(req,res){
    jobs.find({ $or:[{'title':req.params.searchTitle}, 
    {'description': req.params.searchDesc},
    {'keywords': req.params.searchKey}, {'location': req.params.searchLoc}]}, function(err,data){
    if(!err){
        console.log(data)
        res.send(data)
    }
    else{
        console.log(err)
    }
    })
})

app.post('/logout', function(req,res){
    mongoose.connection.db.dropCollection('loggedins', function(err){
if(!err){
 res.send({"flag":"success"})
}
else{
    console.log(err)
}
    })
})
app.get('/', function(req,res) {
    res.sendFile(__dirname+'/index.html');
});

app.listen(2000,function(){
    console.log("server started")
})