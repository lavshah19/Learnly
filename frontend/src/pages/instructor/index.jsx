import InstructorCourses from '@/components/instructor-views/courses'
import InstructorDashboard from '@/components/instructor-views/dashboard'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthContext } from '@/context/auth-context'
import { InstructorContext } from '@/context/instructor-context'
import { fetchInstructorCourseListService } from '@/services'
import { BarChart, Book, LogOut, Menu, X } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'



const InstructorDashboardPage = () => {
  const {resetCredentials}=useContext(AuthContext);
  const{instructorCourseList, setInstructorCourseList, activeTab, setActiveTab}=useContext(InstructorContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
async function fetchAllCourses(){
 try{
   const response=await fetchInstructorCourseListService();
  if(response?.success){
    // console.log(response);
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

function handleMenuClick(value) {
  if (value === "logout") {
    handelLogout();
  } else {
    setActiveTab(value);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  }
}
// console.log(instructorCourseList);


  return (
    <div className='flex h-full min-h-screen bg-gray-100'>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`w-64 bg-white shadow-md transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 fixed md:relative z-50 h-screen border`}>
        <div className='p-4'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-bold'>Instructor view</h2>
            <Button
              variant="ghost"
              size="sm"
              className='md:hidden'
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
          <nav>
            {
              menuItems.map(menuItem =>(
                <Button key={menuItem.value} 
                variant={activeTab === menuItem.value ? "outline" : "ghost"}
                className="w-full justify-start mb-2"  
                onClick={() => handleMenuClick(menuItem.value)} >
                  <menuItem.icon className='mr-2 h-4 w-4'
                  />
                  {menuItem.label}

                </Button>
              ))
            }
          </nav>
        </div>
      </aside>
      
      <main className='flex-1 p-8 overflow-y-auto md:ml-0'>
        <div className='max-w-7xl mx-auto'>
          {/* Mobile Header */}
          <div className='flex items-center justify-between mb-8 md:hidden'>
            <h1 className='text-2xl font-bold'>Dashboard</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className='h-4 w-4' />
            </Button>
          </div>
          
          {/* Desktop Header */}
          <h1 className='text-3xl font-bold mb-8 hidden md:block'>
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