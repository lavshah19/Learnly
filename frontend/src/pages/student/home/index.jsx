import { courseCategories } from "@/config";
// import banner from "../../../../public/banner.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import { checkCoursePurchaseInfoService, fetchStudentViewCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";

const StudentHomePage = () => {
  const navigate=useNavigate();
  const { studentViewCoursesList, setStudentViewCoursesList, setCurrentCourseDetailsId } =
    useContext(StudentContext);
    const{authUser:auth}=useContext(AuthContext);
  async function fetchAllStutendtViewCourses() {
    try {
      const response = await fetchStudentViewCourseListService({});
      if (response?.success) {
        setStudentViewCoursesList(response?.data);
        // console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

   async function handleCourseNavigate(getCurrentCourseId) {
      try {
        const response = await checkCoursePurchaseInfoService(
          getCurrentCourseId,
          auth?.user?.userId
        );
  
        if (response?.success) {
          if (response?.data) {
            setCurrentCourseDetailsId(null);
            navigate(`/course-progress/${getCurrentCourseId}`);
          } else {
            setCurrentCourseDetailsId(null);
            navigate(`/course/details/${getCurrentCourseId}`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

      function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("Filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("Filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }
  useEffect(() => {
    fetchAllStutendtViewCourses();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8 ">
        <div className="lg:w-1/2 lg:pr-12  ">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 ">
            Unlock Skills for a Brighter Future
          </h1>
          <p className="text-md text-gray-600">
            Learn practical, in-demand skills that help you grow your career,
            stay ahead in your field, and achieve your goals.
          </p>
        </div>
        <div className="lg:w-1/2 mb-8 lg:mb-0 mt-4 md:mt-0 ">
          <img
            src={"/banner.png"}
            alt="banner of learnly"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                key={courseItem?._id}
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    Rs {courseItem?.pricing}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentHomePage;
