import { GraduationCap, TvMinimalPlay } from 'lucide-react'
import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { AuthContext } from '@/context/auth-context'

const StudentViewHeaderComponent = () => {
     const navigate=useNavigate();
     const {resetCredentials}=useContext(AuthContext);
 function handelLogout(){
  resetCredentials();
  sessionStorage.clear();
}
  return (
   <header className='flex items-center justify-between p-4 border-b relative '>
<div className='flex items-center space-x-4'>
<Link to='/' className='flex items-center  hover:text-black'>
<GraduationCap className='h-8 w-8 ' />
<span className='font-extrabold md:text-xl text-[14px] '>LEARNLY</span>
</Link>
<div className='flex items-center space-x-1'>
    <Button 
    onClick={() =>{
        location.pathname.includes("/courses")? null : navigate("/courses")
    }}
    className="text-[14px] md:text-[16px] font-medium">
        Explore Courses
    </Button>
</div>
</div>
<div className='flex items-center space-x-4'>
    <div className='flex items-center gap-4'>
   <div onClick={() => navigate('/student-courses')} className='cursor-pointer flex items-center gap-3'>
    <span className='  font-extrabold md:text-xl text-[14px] '>
        My Courses
    </span>
     <TvMinimalPlay className='h-8 w-8 cursor-pointer'/>
   </div>
    </div>
    <Button onClick={handelLogout}>Logout</Button>
</div>
   </header>
  )
}

export default StudentViewHeaderComponent