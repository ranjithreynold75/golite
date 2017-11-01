var express=require("express");
var app=express();
var bodyparser=require("body-parser");

var http=require('http').Server(app);
var io=require('socket.io')(http);

var data=0;
var temp=0,hum=0;

function notify(req,res,next)
{
    console.log("request been made"+req.url);
    next();
}

app.use(notify);
app.use(bodyparser.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({limit: '50mb', extended: true}));


io.on("connection",function(socket)
{
    console.log("A user connected:" + socket.id);

    socket.join("room-golite");

    socket.emit("notify",{'message':"Welcome to Golite"});

});


app.get('/',function(req,res){
    res.send("<marquee>GoLite is online By vivek and his team</marquee>");
});
app.get('/high',function(req,res){
    console.log("high");
    io.to("room-golite").emit('notify',{'message':"Grocery level is HIGH"});
    res.send("done");
});

app.get('/low',function(req,res){
    console.log("low");
    io.to("room-golite").emit('notify',{'message':"Grocery level is LOW"});
    res.send("done");
});

app.get("/data",function (req,res) {

    data=(((10-req.query.data)/10)*100);
    temp=req.query.t;
    hum=req.query.h;
console.log("storage");
console.log(data);
res.send("done");
});

app.post("/datum",function(req,res){
   var d={
       result:[{
           storage:data,
           temp:temp,
           hum:hum
       }]
   };
    res.send(JSON.stringify(d));

});


var server=http.listen(process.env.PORT || 5000,function(){
    console.log("server running in port "+(process.env.PORT || 5000));
});

