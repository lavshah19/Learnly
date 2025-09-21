
import { Outlet, useLocation } from 'react-router-dom'
import StudentViewHeaderComponent from './Header'

const StudentCommonViewLayout = () => {
  const location = useLocation();
  return (
    <div>
        {!location.pathname.includes("course-progress") ? (
        <StudentViewHeaderComponent/>
      ) : null}
        <Outlet/>
    </div>
  )
}

export default StudentCommonViewLayout