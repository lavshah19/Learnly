import FormControls from '@/components/common-form/Form-controls'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { courseLandingPageFormControls } from '@/config'
import { InstructorContext } from '@/context/instructor-context'
import React, { useContext } from 'react'

const CourseLaning = () => {
  const{courseLandingFormData, setCourseLandingFormData}=useContext(InstructorContext);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Laning Page</CardTitle>

      </CardHeader>
      <CardContent>
      <FormControls formControls={courseLandingPageFormControls}   formData={courseLandingFormData}
        setFormData={setCourseLandingFormData}/>
      


      
      </CardContent>
    </Card>
  )
}

export default CourseLaning