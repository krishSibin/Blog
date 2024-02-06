const express=require('express')
const app=express();
const router=express.Router();
const UserModel=require('./../model/User')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const multer  = require('multer')
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs= require('fs');
const Post =  require('./../model/Post')

//const cors = require('cors');

const salt2="skdnbashuvfhufbgjabsdjvsdijbsdigijs"
mongoose.connect('mongodb+srv://sibinkrishnakt:GFoMhJWZGNPb40AS@cluster0.wcrj9cg.mongodb.net/?retryWrites=true&w=majority');



 //app.use(cors({credentials:true,origin:'http://localhost:3000'}));

router.post('/register',async (req,res)=>{
    const {name,password}=req.body;
  
    try{
        
       const hash = bcrypt.hashSync(password, salt);
        const userDoc =await UserModel.create({userName:name,
        password:hash,
    });
    console.log(userDoc)
        res.status(200).json(userDoc);
    }
    catch(e){
        res.status(400).json(e);
        console.log(e)
    }
 
    
    console.log('sucessfull')
})



router.post('/login',async (req,res)=>{
    const {name,password}=req.body;
   const userDoc= await UserModel.findOne({userName:name});

     const pass= bcrypt.compareSync(password,userDoc.password);

     if(pass)
     {
        jwt.sign({name,id:userDoc._id},salt2,{},(err,token)=>{
            if(err) throw err;
            

            res.cookie('token',token).json({
                id:userDoc._id,
                name,
            });
        });

     }
     else{
        res.status(400).json('Wrong credentials')
        
     }

     
})

router.get('/profile', (req, res) => {
   
    const {token}=req.cookies;
  //  console.log(token)

    jwt.verify(token,salt2,{},(err,info)=>{
        if(err) throw err;
        res.json(info);
       // console.log(info)
    }) 


   
});

router.post('/logout',(req,res)=>{
    res.cookie('token','').json('ok');
})

router.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
 //   res.json({content:req.body.content});
 const {originalname,path} = req.file;
 const parts =originalname.split('.');
 const ext = parts[parts.length - 1];
 const newPath = path+'.'+ext;
 fs.renameSync(path,newPath);

 const {title,summary,content} = req.body;



 const postDoc= await Post.create({
    title,
    summary,
    content,
    cover:newPath,
});


 res.json(postDoc); 


});

router.get('/post',async (req,res)=>{
    res.json(await Post.find());
})




module.exports=router;

