import { response } from "express";
import {v2 as cloudinary} from "cloudinary"
import fs from 'fs';

// configuration
        cloudinary.config({
            cloud_name : process.env.CLOUD_NAME,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret
        })

const cloudinaryLink = async function (localFilePath) {
    try {
        if(!localFilePath)null;

        //upload an document
        const uploadResult = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        // file has uploaded successfully

        console.log("file has uploaded in cloudinary",uploadResult.url);
        return uploadResult
    } catch (error) {
        fs.unlinkSync(localFilePath)
        // locally saved tempory file as upload operation file
    
        return null
    }
    
}

export {cloudinaryLink}