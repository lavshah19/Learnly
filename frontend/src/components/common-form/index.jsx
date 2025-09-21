
import { Button } from "../ui/button"
import  FormControls  from "./Form-controls"

// common form for signup and signin
const CommonForm = ({handelSubmit, buttonText,formControls = [], formData, setFormData,isButtonDisabled=false}) => {
  return (
    <form onSubmit={handelSubmit}>
        {/* render form controls here */}
        <FormControls formControls={formControls} formData={formData} setFormData={setFormData} />
        <Button disabled={isButtonDisabled} className="mt-4 w-full" type="submit">{buttonText || "Submit"}</Button>
    </form>
  )
}

export default CommonForm