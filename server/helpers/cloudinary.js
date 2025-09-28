const cloudinary = require("cloudinary").v2;
const multer = require("multer");


cloudinary.config({
    cloud_name: 'dhcc2fq3i',
    api_key: '551118357541853',
    api_secret: 'vfvLKWL13-uqzLtNpNL_4Is97_s'
})

const storage = new multer.memoryStorage();

async function imageUploadUtil(file){
    const result = await cloudinary.uploader.upload(file, {
        resource_type: 'auto'
    })

    return result;
}

const upload = multer({storage});

module.exports = {upload, imageUploadUtil};