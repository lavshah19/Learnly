import InstructorCourses from '@/components/instructor-views/courses'
import InstructorDashboard from '@/components/instructor-views/dashboard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthContext } from '@/context/auth-context'
import { InstructorContext } from '@/context/instructor-context'
import { fetchInstructorCourseListService } from '@/services'
import { BarChart, Book, LogOut } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'



const InstructorDashboardPage = () => {
  const {resetCredentials}=useContext(AuthContext);
  const{instructorCourseList, setInstructorCourseList, activeTab, setActiveTab}=useContext(InstructorContext);
async function fetchAllCourses(){
 try{
   const response=await fetchInstructorCourseListService();
  if(response?.success){
    console.log(response);
    setInstructorCourseList(response.data);
  }
 }catch(error){
  console.log(error);
 }
 }

useEffect(()=>{
fetchAllCourses();

},[])

  const menuItems = [
  {
    icon: BarChart,
    label: "Dashboard",
    value: "dashboard",
    component: <InstructorDashboard listOfCourses={instructorCourseList}  />
  },
  {
    icon: Book,
    label: "Courses",
    value: "courses",
    component: <InstructorCourses listOfCourses={instructorCourseList} fetchAllCourses={fetchAllCourses} />

  },
  {
    icon: LogOut,
    label: "Logout",
    value: "logout",
    component: null

  }

]

function handelLogout(){
  resetCredentials();
  sessionStorage.clear();
}
// console.log(instructorCourseList);


  return (
    <div className='flex h-full min-h-screen bg-gray-100'>
      <aside className='w-64 bg-white shadow-md hidden md:block ' >
        <div className='p-4'>
          <h2 className='text-2xl font-bold mb-4'>Instructor view</h2>
          <nav>
            {
              menuItems.map(menuItem =>(
                <Button key={menuItem.value} 
                variant={activeTab === menuItem.value ? "outline" : "ghost"}
                className="w-full justify-start mb-2"  onClick={menuItem.value === "logout"? handelLogout : () => setActiveTab(menuItem.value)} >
                  <menuItem.icon className='mr-2 h-4 w-4'
                  />
                  {menuItem.label}

                </Button>
              ))
            }
          </nav>
        </div>
      </aside>
      <main className='flex-1 p-8 overflow-y-auto '>
        <div className='max-w-7xl mx-auto'>

          <h1 className='text-3xl font-bold mb-8'>
            Dashboard
          </h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {
              menuItems.map(menuItem => (
                <TabsContent key={menuItem.value} value={menuItem.value}>
                  {
                    menuItem.component !== null ? menuItem.component : null
                  }
                </TabsContent>
              ))
            }

          </Tabs>
        </div>

      </main>
    </div>

  )
}

export default InstructorDashboardPage