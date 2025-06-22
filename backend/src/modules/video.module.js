import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema({
    videoFile: {
        type: String, //cloudinary url 
        required: true
    },
    thumbnail: {
        type: String, //cloudinary url 
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    duration: {
        type: String,  
        required: true
    },
    views: {
        type: String, 
        required: true
    },
    isPublished: {
        type: String,  
        required: true
    },
    owner: {
        type: String,  
        required: true
    }
},
{
    timestamps: true
})

export const video = mongoose.model("Video",videoSchema)