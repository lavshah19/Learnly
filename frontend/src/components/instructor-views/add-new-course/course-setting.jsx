import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaDeleteService, mediaUploadService } from "@/services";
import React, { useContext } from "react";

const CourseSetting = () => {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    setMediaUploadProgress,
    mediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);
  async function handelImageUpload(e) {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);
      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseLandingFormData = {...courseLandingFormData};
          cpyCourseLandingFormData.image = response.data.url;
          cpyCourseLandingFormData.public_id = response.data.public_id;
          setCourseLandingFormData(cpyCourseLandingFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
        setMediaUploadProgress(false);
      }
    }
  }
  async function handelReplaceImage() {
 let cpyCourseCurriculumFormData = {...courseLandingFormData};
    const currentVideoPublicId =
      cpyCourseCurriculumFormData.public_id;
    try {
      const deleteCurrentVideoResponse = await mediaDeleteService(
        currentVideoPublicId,
        "image"
      );
      console.log(deleteCurrentVideoResponse);
      if (deleteCurrentVideoResponse.success) {
        cpyCourseCurriculumFormData.image = "";
        cpyCourseCurriculumFormData.public_id = "";
        setCourseLandingFormData(cpyCourseCurriculumFormData);
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log(courseLandingFormData);

  return (
    <Card>
      <CardHeader className={"flex justify-between gap-3"}>
        <CardTitle>Course Setting</CardTitle>
        {
          courseLandingFormData.image && (
            <Button onClick={handelReplaceImage}>Replace Image</Button>
          )
        }
      </CardHeader>
   
      {mediaUploadProgress && (
        <div className="mt-2">
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            mediaUploadProgress={mediaUploadProgressPercentage}
          ></MediaProgressbar>
        </div>
      )}
      <CardContent>
        <div className="flex flex-col gap-3"></div>
        {courseLandingFormData.image ? (
          <img
            src={courseLandingFormData.image}
            className="object-cover rounded-md"
          />
        ) : (
          <div className="flex flex-col gap-3">
            <Label className="mb-2">Upload Course Image</Label>
            <Input
              onChange={handelImageUpload}
              type="file"
              accept="image/*"
              className="mb-4"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSetting;
