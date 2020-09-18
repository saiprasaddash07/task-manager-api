const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: 
    {
        type:String,
        required:true,
        trim:true
    },
    email:
    {
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid here');
            }
        }
    },
    age:
    {
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number');
            }
        }
    },
    password:
    {
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length <= 6){
                throw new Error('Please enter a password greater than 6 letter');
            }
            if(value.toLowerCase().includes("password")){
                throw new Error('Value can not conatain "password" ');
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    //timestamps:true,
});

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
}); // to get all the files from task model

// userSchema.methods.getPublicProfile = function(){
//     const user = this;

//     const userObject = user.toObject();

//     delete userObject.password;
//     delete userObject.tokens;

//     return userObject;
// }

userSchema.methods.toJSON = function(){
    const user = this;
    
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function(){ //methods are available on instances
    const user = this;
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({token});
    await user.save();
    
    return token;
}

userSchema.statics.findByCredentials = async(email,password) => { //static method is available on models
    const user = await User.findOne({email});

    if(!user){
        throw new Error('Unable to log in');
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        throw new Error('Unable to log in');
    }

    return user;
}

userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }

    next();
})

userSchema.pre('remove',async function(next){
    const user = this;

    await Task.deleteMany({owner:user._id});
    next();
});

const User = mongoose.model('User',userSchema); // we are adding middleware to user so we added schema

module.exports = User;