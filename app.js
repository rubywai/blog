const express = require('express')
const multer = require('multer')
const paths = require('path')

const app = express()
const { getPosts, getOnePost, addPost, updatePost, deletePost } = require('./database');

app.use("/uploads", express.static(paths.join(__dirname, 'uploads')));

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads');
   },
  filename: function (req, file, cb) {
      var ext = (file.originalname.split('.').slice(-1)[0]);
      cb(null , '' +Date.parse(Date())+'.'+ext);
  }
});

const upload = multer({storage : storage})

app.get('/', async(req,res) => {
  res.sendFile(paths.join(__dirname, 'uploads/inedex.html'))
})
app.get('/posts',async(req,res) => {
  try{
  let result = await getPosts();
  res.send(result)
  }
  catch (error) {
    console.log('error found');
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }
})
app.get('/post',async(req,res) => {
  
  try{
    let id = req.query.id;
    let result = await getOnePost(id)
    res.send(result)
  }
  catch (error) {
    console.log('error found');
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }
}
)
app.post('/post',upload.single('photo'),async(req,res) => {
  try{
    let title = req.query.title
    let body = req.query.body
    let image = req.file
    let url = ''
    if(image == null){
      url = null
    }
    else {
      url = image['path']
    }
    console.log(title)
    let result = await addPost(title,body,url)
    res.send({'result' : 'successfully uploaded'})

  }
  catch (error) {
    console.log('error found');
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }
  
})

app.put('/post',async(req,res) =>{
  try{
    let id = req.query.id;
    let title = req.query.title;
    let body = req.query.body;
    let result = await updatePost(id,title,body)
    res.send({'result' : 'successfully Updated'})
  }
  catch (error) {
    console.log('error found');
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }
})
app.delete('/post',async(req,res) =>{
  try{
    let id = req.query.id;
    let result = await deletePost(id)
    res.send({'result' : 'successfully Deleted'})
  }
  catch (error) {
    console.log('error found');
    res.status(error.status || 500).send({
      error: {
        status: error.status || 500,
        message: error.message || "Internal Server Error",
      },
    });
  }
})


app.use((req, res, next) => {
  console.log('executing');
  res.status(500).send({
    status: 404,
    error: 'Not found'
  })
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    error: {
      status: error.status || 500,
      message: error.message || 'Internal Server Error',
    },
  });
});
app.listen(process.env.PORT || 5000)
