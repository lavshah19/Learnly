import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { use, useContext } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InstructorContext } from "@/context/instructor-context";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { toggleCoursePublishService } from "@/services";

const InstructorCourses = ({ listOfCourses,fetchAllCourses }) => {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);



  async function handelTogglePublish(id) {
  try{
    const data  = await toggleCoursePublishService(id);
    if(data.success){
      console.log(data);
      
      fetchAllCourses();
    }

   
  }catch(e){
    console.log(e);
  }
}

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row items-center">
        <CardTitle className="text-3xl font-extrabold">All Courses</CardTitle>
        <Button
          className="p-6"
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/add-new-course");
          }}
        >
          create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            {/* <TableCaption>A list of your courses.</TableCaption> */}
            <TableHeader>
              <TableRow>
                <TableHead>course</TableHead>
                <TableHead>student</TableHead>
                <TableHead>Revenue (Rs)</TableHead>
                 <TableHead>isPublished</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses &&
                listOfCourses.length > 0 &&
                listOfCourses.map((course) => {
                  return (
                    <TableRow key={course._id}>
                      <TableCell className="font-medium">
                        {course.title}
                      </TableCell>
                      <TableCell>{course?.students?.length}</TableCell>
                      <TableCell>{course?.students?.length * course?.pricing}</TableCell>
                      <TableCell>{course.isPublised ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => {
                             setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
                           navigate(`/instructor/edit-course/${course?._id}`);
                          }}
                          variant="ghost"
                          size={"sm"}
                        >
                          <Edit className="h-6 w-6" />
                        </Button>
                        <Button onClick={() => handelTogglePublish(course?._id)} variant="ghost" size={"sm"}>
                          <Delete className="h-6 w-6" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCourses;
