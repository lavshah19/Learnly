const express=require("express");
const router=express.Router();
const{uploadMediaToCloudinary,deleteMediaToCloudinary}=require("../../helpers/cloudinary")
const multer=require("multer");
const upload = multer({ dest: "uploads/" });
router.post('/upload',upload.single('file'),async(req,res)=>{
    try {
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"No file uploaded"
            })
        }
        // console.log("enterrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
        const result=await uploadMediaToCloudinary(req.file.path);
        res.status(200).json({
            success:true,
            message:"File uploaded successfully",
            data:result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong while uploading file",
            error
})
    }
})
router.delete('/delete/:id',async(req,res)=>{
    try {
        if(!req.params.id){
            return res.status(400).json({
                success:false,
                message:"No file uploaded by this id"
            })
        }
        // console.log(req.params.id);


        
        
        const result=await deleteMediaToCloudinary(req.params.id, req.query.resourceType || "image");
        // console.log(result);
            if (result.result !== "ok") {
            return res.status(400).json({
                success: false,
                message: "File not deleted",
                data: result
            });
        }
        res.status(200).json({
            success:true,
            message:"File deleted successfully",
            data:result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong while deleting file",
            error
})
    }
})
router.post("/bulk-upload", upload.array("files", 10), async (req, res) => {
  try {
    const uploadPromises = req.files.map((fileItem) =>
      uploadMediaToCloudinary(fileItem.path)
    );

    const results = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (event) {
    console.log(event);

    res.status(500).json({ success: false, message: "Error in bulk uploading files" });
  }
});
module.exports=router
