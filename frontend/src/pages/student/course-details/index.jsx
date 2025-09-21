import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { generateUniqueId } from "esewajs";
import {
  CheckCircle,
  Globe,
  Lock,
  PlayCircle,
  Trophy,
  User,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function StudentViewCourseDetailPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const { authUser: auth } = useContext(AuthContext);
  const { id } = useParams();
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  async function fetchStudentViewCourseDetails() {
       const checkCoursePurchaseInfoResponse =
      await checkCoursePurchaseInfoService(
        currentCourseDetailsId,
        auth?.user.userId
      );

    if (
      checkCoursePurchaseInfoResponse?.success &&
      checkCoursePurchaseInfoResponse?.data
    ) {
      navigate(`/course-progress/${currentCourseDetailsId}`);
      return;
    }
 
    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );
    // console.log(response, "response");

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }
  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?.userId,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "Esewa",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: generateUniqueId(),
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      setApprovalUrl(response?.url);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId) {
      fetchStudentViewCourseDetails();
    }
  }, [currentCourseDetailsId]);
  useEffect(() => {
    setCurrentCourseDetailsId(id);
  }, [id]);
  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;
  if (loadingState) {
    return <Skeleton />;
  }
  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  // console.log(getIndexOfFreePreviewUrl), "getIndexOfFreePreviewUrl";
  // console.log(studentViewCourseDetails, "studentViewCourseDetails" );

  return (
    <div className="mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg ">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>Created By: {studentViewCourseDetails?.instructorName}</span>
          <span>
            Created On:{" "}
            {studentViewCourseDetails?.date
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}
          </span>
          <span className="flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <Trophy className="w-4 h-4 mr-1" />
          <span>{studentViewCourseDetails?.level}</span>
          <span className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {`${studentViewCourseDetails?.students?.length} ${
              studentViewCourseDetails?.students?.length > 1
                ? "Students"
                : "Student"
            }`}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8 ">
        <main className="flex-grow">
          <Card className={"mb-8"}>
            <CardHeader>
              <CardTitle>Objective of the Course</CardTitle>
              <CardDescription>
                {studentViewCourseDetails?.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>{studentViewCourseDetails?.description}</CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    key={index}
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={
                      curriculumItem?.freePreview
                        ? () => handleSetFreePreview(curriculumItem)
                        : null
                    }
                  >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold">
                  Rs {studentViewCourseDetails?.pricing}
                </span>
              </div>
              <Button onClick={handleCreatePayment} className="w-full">
                Buy Now
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="w-[800px]">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
            <DialogDescription>
              Watch free previews of this course before purchasing.
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="450px"
              height="200px"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[16px] font-medium">other Previews</p>
            {studentViewCourseDetails?.curriculum
              ?.filter((item) => item.freePreview)
              .map((filteredItem, index) => (
                <p
                  key={index}
                  onClick={() => handleSetFreePreview(filteredItem)}
                  className="cursor-pointer text-[16px] font-medium border-b pb-2 border-gray-400"
                >
                  {filteredItem?.title}
                </p>
              ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
