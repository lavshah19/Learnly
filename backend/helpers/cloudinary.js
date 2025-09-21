const Cloudinary=require("cloudinary").v2;

Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
    api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
    api_secret: process.env.CLOUDINARY_API_SECRET  // Your Cloudinary API secret
});

async function uploadMediaToCloudinary(filePath) {
    try {
        const result = await Cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error.message);
        throw new Error(`Failed to upload media: ${error.message}`);
    }
}

async function deleteMediaToCloudinary(publicId,resourceType = "image") {
    try {
        const result = await Cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
        return result;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete media from Cloudinary");
    }
}

module.exports={uploadMediaToCloudinary,deleteMediaToCloudinary};