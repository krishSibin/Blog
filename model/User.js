const mongoose=require('mongoose')
const {Schema,model}=mongoose

const UserSchema =new Schema({
    userName:{
        type:String,
        required:true,     
        unique:true,
    },
    password:{
        type:String,
        required:true,
    }
});

// UserModel=mongoose.model({'User',UserSchema});

const UserModel=model('data',UserSchema);

module.exports=UserModel;