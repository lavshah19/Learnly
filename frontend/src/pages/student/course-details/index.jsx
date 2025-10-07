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

    // console.log(paymentPayload, "paymentPayload");
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
    <div className="mx-auto p-2 sm:p-4">
      <div className="bg-gray-900 text-white p-4 sm:p-6 md:p-8 rounded-t-lg">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-base sm:text-lg md:text-xl mb-2 sm:mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
          <span className="break-words">Created By: {studentViewCourseDetails?.instructorName}</span>
          <span className="break-words">
            Created On:{" "}
            {studentViewCourseDetails?.date
              .split("T")[0]
              .split("-")
              .reverse()
              .join("/")}
          </span>
          <span className="flex items-center">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span className="flex items-center">
            <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {studentViewCourseDetails?.level}
          </span>
          <span className="flex items-center">
            <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {`${studentViewCourseDetails?.students?.length} ${
              studentViewCourseDetails?.students?.length > 1
                ? "Students"
                : "Student"
            }`}
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 mt-4 sm:mt-6 lg:mt-8">
        <main className="flex-grow order-2 lg:order-1">
          <Card className="mb-4 sm:mb-6 lg:mb-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Objective of the Course</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {studentViewCourseDetails?.description}
              </CardDescription>
            </CardHeader>
            <CardContent >
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base">{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="mb-4 sm:mb-6 lg:mb-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Course Description</CardTitle>
            </CardHeader>
            <CardContent className="text-sm sm:text-base">
              {studentViewCourseDetails?.description}
            </CardContent>
          </Card>
          <Card className="mb-4 sm:mb-6 lg:mb-8">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent >
              <ul className="space-y-3">
                {studentViewCourseDetails?.curriculum?.map(
                  (curriculumItem, index) => (
                    <li
                      key={index}
                      className={`${
                        curriculumItem?.freePreview
                          ? "cursor-pointer hover:bg-gray-50 p-2 rounded"
                          : "cursor-not-allowed opacity-60"
                      } flex items-center transition-colors`}
                      onClick={
                        curriculumItem?.freePreview
                          ? () => handleSetFreePreview(curriculumItem)
                          : null
                      }
                    >
                      {curriculumItem?.freePreview ? (
                        <PlayCircle className="mr-3 h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
                      ) : (
                        <Lock className="mr-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                      )}
                      <span className="text-sm sm:text-base break-words">{curriculumItem?.title}</span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>
        </main>
        <aside className="w-full lg:w-[400px] xl:w-[500px] order-1 lg:order-2">
          <Card className="sticky top-4">
            <CardContent className="p-4 sm:p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center bg-gray-100">
                <VideoPlayer
                  url={
                    getIndexOfFreePreviewUrl !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreviewUrl
                        ].videoUrl
                      : ""
                  }
                  width="100%"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-2xl sm:text-3xl font-bold">
                  Rs {studentViewCourseDetails?.pricing}
                </span>
              </div>
              <Button onClick={handleCreatePayment} className="w-full text-sm sm:text-base">
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
        <DialogContent className="w-[95vw] max-w-[95vw] sm:max-w-[600px] md:max-w-[800px] p-3 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">Course Preview</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Watch free previews of this course before purchasing.
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-video rounded-lg flex items-center justify-center w-full mb-4 bg-gray-100">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="200px"
              style={{ maxWidth: "100%" }}
            />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-sm sm:text-base font-medium">Other Previews</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {studentViewCourseDetails?.curriculum
                ?.filter((item) => item.freePreview)
                .map((filteredItem, index) => (
                  <p
                    key={index}
                    onClick={() => handleSetFreePreview(filteredItem)}
                    className="cursor-pointer text-sm sm:text-base font-medium border-b pb-2 border-gray-400 hover:bg-gray-50 p-2 rounded transition-colors break-words"
                  >
                    {filteredItem?.title}
                  </p>
                ))}
            </div>
          </div>
          <DialogFooter className="pt-4 sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="w-full sm:w-auto">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
