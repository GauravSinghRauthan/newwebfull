import mongoose,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username:{
        type: String,
        lowercase: true,
        require: true,
        unique: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        lowercase: true,
        unique:true,
        trim: true,
        require: true,
    },
    fullName:{
        type: String,
        lowercase: true,
        require: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,
        require: true
    },

    Coverimage:{
        type: String
    },
    username:[
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    Password:{
        type: String,
        require: true
    },
    refreshToken:{
        type: String,
        require: true
    }
},{
    timestamps: true
})

userSchema.pre("save",async function (next) {
    if(!this.isModified(this.Password))next();

    this.Password = await bcrypt.hash(this.Password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName


        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const user = mongoose.model('user',userSchema)