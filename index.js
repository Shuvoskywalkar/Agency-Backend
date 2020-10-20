const express = require('express')
const app = express()
const cors=require('cors')
const BodyParser=require('body-parser')
const port = 600
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Creative-User:JoyBangla@cluster0.znbhd.mongodb.net/Creative-Agency?retryWrites=true&w=majority";
const fileUpload = require('express-fileupload');
const fs=require('fs')
require('dotenv').config()

app.use(cors())
app.use(BodyParser.json())
app.use(fileUpload())
app.use(express.static('servicelist'))



const client = new MongoClient(uri, { useNewUrlParser: true , useUnifiedTopology: true});
client.connect(err => {
  const CollectionReview = client.db("Creative-Agency").collection("Reviews")
  const CollectionService = client.db("Creative-Agency").collection("Services");
  const CollectionAdminEmail = client.db("Creative-Agency").collection("AdminEmail");
  const CollectionOrders = client.db("Creative-Agency").collection("OrderDetails");
  const CollectionFeedback=client.db("Creative-Agency").collection("FeedbackCollection");

  // perform actions on the collection object
  // client.close();
  app.post('/CollectionReview',(req,res)=>{
    console.log(req.body)
    const Reviews=req.body
    res.send(Reviews)
    CollectionReview.insertMany(Reviews)
  
    .then(result=>console.log(result.insertedCount))

  })
  app.get('/Reviews',(req,res)=>{
    CollectionReview.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
      //Services

  app.post('/CollectionService',(req,res)=>{
    const services=req.body
    CollectionService.insertMany(services)
    res.send(services)
    .then(result=>console.log(result.insertedCount))
  })
  app.get('/Services',(req,res)=>{
    CollectionService.find({})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })
//AdEmail
app.post("/AdminEmail",(req,res)=>{
  const email=req.body
  console.log(email)
  CollectionAdminEmail.insertOne(email)
  .then(result=>{
    res.send(result)
    // console.log(result)  
  })
})

app.get('/AdminEmailHere',(req,res)=>{
  const email=req.query.email
  console.log(email)
  CollectionAdminEmail.find({email:email})
  .toArray((err,documents)=>{
    res.send(documents)
    console.log(documents)
  })
})

//USEmail

app.post("/UserInfo",(req,res)=>{
  const email=req.body
  console.log(req.body)
  CollectionOfUsers.insertOne(email)
  res.send(email)
  .then(result=>{
    console.log(result) 
     
  })
})

app.get('/UserInfoHere',(req,res)=>{
  CollectionOfUsers.find({})
  .toArray((err,documents)=>{
    res.send(documents)
  })
})

app.post("/postOrders",(req,res)=>{
  const order=req.body
  // console.log(order)
  res.send(order)
  CollectionOrders.insertOne(order)
  .then(result=>{
    console.log(result.insertedCount)
  })
})

app.get('/Courses',(req,res)=>{
  const email=req.query.Email
console.log(email)
CollectionOrders.find({Email:email})
.toArray((err,documents)=>{
res.send(documents)
// console.log(documents)
})
})


app.get('/Userinfo',(req,res)=>{
  // const email=req.query.Email
// console.log(email)
CollectionOrders.find({})
.toArray((err,documents)=>{
res.send(documents)
// console.log(documents)
})
})

app.post('/feedbacks',(req,res)=>{
  const feedback=req.body
  CollectionFeedback.insertOne(feedback)
  .then(result=>{
    res.send(feedback)
    console.log(result)
  })

})

app.post('/AddAService',(req,res)=>{
  const file=req.files.file;
  const ServiceName=req.body.Title;
  const Description=req.body.Description

const newImage=file.data
const encImg=newImage.toString('base64')
 const Image = {
  contentType: file.mimetype,
  size: file.size,
  img: Buffer.from(encImg, 'base64')
}
 CollectionService.insertOne({ServiceName,Description,Image})
 .then(result=>{
console.log(result)
   res.send(result.insertedCount>0)}) 
});


app.post('/AddAReview',(req,res)=>{
  const file=req.files.file;
  const name=req.body.Name;
  const says=req.body.Designation
  const position=req.body.Company
  console.log(name,says,file,position)

  const newImage=file.data
  const encImg=newImage.toString('base64')

  const Image={
    contentType:file.mimetype,
    size:file.size,
    img:Buffer.from(encImg,'base64')
  }
  CollectionReview.insertOne({name,says,position,Image})
  .then(result=>{
    console.log(result)
    res.send(result.insertedCount>0)
  })

});

})




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT||port)