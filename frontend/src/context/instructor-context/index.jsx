import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { createContext, useState } from "react";



export const InstructorContext = createContext(null);
export default function InstructorProvider({ children }) {
    const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);
    const [CourseCurriculumFormData, setCourseCurriculumFormData] = useState(courseCurriculumInitialFormData);
   const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
   const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0);
   const [instructorCourseList, setInstructorCourseList] = useState([]);
   const [currentEditedCourseId, setCurrentEditedCourseId] = useState(null);
   const [activeTab, setActiveTab] = useState('dashboard')
   
   
   
   return (
        <InstructorContext.Provider value={{       
            courseLandingFormData, 
            setCourseLandingFormData,
            setCourseCurriculumFormData,
            CourseCurriculumFormData,
            mediaUploadProgress, 
            setMediaUploadProgress,
            mediaUploadProgressPercentage,
            setMediaUploadProgressPercentage,
            instructorCourseList, 
            setInstructorCourseList,
            currentEditedCourseId, 
            setCurrentEditedCourseId,
            activeTab,
            setActiveTab
        }}>
            {children}
        </InstructorContext.Provider>
    )
}