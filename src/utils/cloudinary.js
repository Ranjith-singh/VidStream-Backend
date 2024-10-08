import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUDNAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload_on_cloudinary=async (local_file_path)=>
{
    try
    {
        if(!local_file_path) return null
        // upload the file on cloudinary
        const response=await cloudinary.uploader.upload(
            local_file_path,{
                resource_type : "auto"
            })
        // file has been uploaded succesfully
        console.log("file has been uploaded succesfully ",response.url);
        fs.unlinkSync(local_file_path) //remove the locally saved path
        return response;
    }
    catch(error)
    {
        fs.unlinkSync(local_file_path) //remove the locally saved path
        return null;
    }
}