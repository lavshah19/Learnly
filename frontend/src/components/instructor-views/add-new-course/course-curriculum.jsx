import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services/index";
import { Upload } from "lucide-react";
import { useContext, useRef } from "react";

const CourseCurriculum = () => {
  const bulkUploadRef = useRef(null);

  const {
    CourseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  function isCourseCurriculumFormDataValid() {
    return CourseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }
  async function handelReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
    const currentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;
    try {
      const deleteCurrentVideoResponse = await mediaDeleteService(
        currentVideoPublicId,
        "video"
      );
      console.log(deleteCurrentVideoResponse);
      if (deleteCurrentVideoResponse.success) {
        cpyCourseCurriculumFormData[currentIndex] = {
          ...cpyCourseCurriculumFormData[currentIndex],
          videoUrl: "",
          public_id: "",
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData);
      }
    } catch (error) {
      console.log(error);
    }
  }
  function handelNewLecture() {
    setCourseCurriculumFormData([
      ...CourseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }
  function handelCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }
  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  function handelOpenBulkUploadDialog() {
    bulkUploadRef.current?.click();
  }
  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files); // this Array.from is used to convert the FileList object to an array
    console.log(event.target.files);
    console.log(selectedFiles);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      console.log(response, "bulk");
      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(CourseCurriculumFormData)
            ? []
            : [...CourseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${
              cpyCourseCurriculumFormdata.length + (index + 1)
            }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  }
  // console.log(CourseCurriculumFormData, "CourseCurriculumFormData");

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...CourseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId, "video");

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }


  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle> Create Course Curriculum</CardTitle>
        <Input
          type="file"
          ref={bulkUploadRef}
          accept="video/*"
          multiple
          className={"hidden"}
          id="bulkUploadMedia"
          onChange={handleMediaBulkUpload}
        />
        <Button
          className={"cursor-pointer"}
          htmlFor="bulkUploadMedia"
          variant={"outline"}
          onClick={handelOpenBulkUploadDialog}
        >
          <Upload className="w-4 h-5 mr-2" />
          Bulk Upload
        </Button>
      </CardHeader>
      <CardContent>
        <Button
          disabled={mediaUploadProgress || !isCourseCurriculumFormDataValid()}
          onClick={handelNewLecture}
        >
          Add Lecture
        </Button>
        {mediaUploadProgress && (
          <div className="mt-2">
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              mediaUploadProgress={mediaUploadProgressPercentage}
            ></MediaProgressbar>
          </div>
        )}
        <div className="mt-4 space-y-4">
          {CourseCurriculumFormData.map((curriculumitem, index) => (
            <div key={index} className="border p-5 rounded-md">
              <div className="flex gap-5">
                <h3 className="font-semibold">Lecture {index + 1}</h3>
                <Input
                  name={`title-${index + 1}`}
                  value={CourseCurriculumFormData[index]?.title}
                  placeholder="Enter lecture title"
                  className="max-w-96"
                  onChange={(event) => handelCourseTitleChange(event, index)}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    onCheckedChange={(value) =>
                      handleFreePreviewChange(value, index)
                    }
                    checked={CourseCurriculumFormData[index]?.freePreview}
                    id={`freePreview-${index + 1}`}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    free preview
                  </Label>
                </div>
              </div>
              <div className="mt-6">
                {CourseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex gap-3">
                    <VideoPlayer
                      url={CourseCurriculumFormData[index]?.videoUrl}
                      width="450px"
                      height="200px"
                    />
                    <Button onClick={() => handelReplaceVideo(index)}>
                      Replace Video
                    </Button>
                    <Button onClick={()=>handleDeleteLecture(index)} className={"bg-red-600"}>Remove Lecture</Button>
                  </div>
                ) : (
                  <Input
                    placeholder="Enter video Url"
                    accept="video/*"
                    type="file"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculum;
