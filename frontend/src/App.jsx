
import { Routes, Route } from "react-router-dom"
import AuthPage from "./pages/auth"
import RouteGuard from "./components/route-guard"
import { useContext } from "react"
import { AuthContext } from "./context/auth-context";
import InstructorDashboardPage from "./pages/instructor";
import StudentCommonViewLayout from "./components/student-views/CommonLayout";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursePage from "./pages/instructor/add-new-course";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailPage from "./pages/student/course-details";
import Success from "./pages/student/payment/Success";
import Failure from "./pages/student/payment/Failure";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";



function App() {
  const {authUser}=useContext(AuthContext);
  return (
  <>
  <Routes>
    <Route
    path='/auth'
    element={
      <RouteGuard
      element={<AuthPage />}
      authenticated={authUser.authenticate}
      user={authUser.user}>
     
      </RouteGuard>
    }/>
     <Route
    path='/instructor'
    element={
      <RouteGuard
      element={<InstructorDashboardPage />}
      authenticated={authUser.authenticate}
      user={authUser.user}>
     
      </RouteGuard>
    }/>
     <Route
    path='/instructor/add-new-course'
    element={
      <RouteGuard
      element={<AddNewCoursePage />}
      authenticated={authUser.authenticate}
      user={authUser.user}>
     
      </RouteGuard>
    }/>
     <Route
    path='/instructor/edit-course/:courseId'
    element={
      <RouteGuard
      element={<AddNewCoursePage />}
      authenticated={authUser.authenticate}
      user={authUser.user}>
     
      </RouteGuard>
    }/>
     <Route
    path='/'
    element={
      <RouteGuard
      element={<StudentCommonViewLayout />}
      authenticated={authUser.authenticate}
      user={authUser.user}>
     
      </RouteGuard>
    }>
      <Route path='/' element={<StudentHomePage />} />
      <Route path='/home' element={<StudentHomePage />} />
       <Route path='/courses' element={<StudentViewCoursesPage />} />
      <Route path='/course/details/:id' element={<StudentViewCourseDetailPage />} />
        <Route path="/payment-success" element={<Success/>} />
        <Route path="/payment-failure" element={<Failure/>} />
     <Route path="/student-courses" element={<StudentCoursesPage />} />
      <Route
          path="course-progress/:id"
          element={<StudentViewCourseProgressPage />}
        />
   
    </Route>
    <Route path='*' element={<NotFoundPage/>} />
  </Routes>
  
  
  </>
    
  )
}

export default App
