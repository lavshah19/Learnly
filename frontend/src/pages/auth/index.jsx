import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useContext, useState } from "react";
import CommonForm from "@/components/common-form";
import { initialSignInFormData, initialSignUpFormData, signinFormControls, signUpFormControls } from "@/config";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AuthContext } from "@/context/auth-context";

const AuthPage = () => {
    
    const { signInFormData,
        setSignInFormData,
        signUpFormData,
        setSignUpFormData,
    handelRegisterUser
,handelLoginUser,activeTab,setActiveTab}=useContext(AuthContext);

    const handelTabChange = (tab) => {
        
        if (tab === "signin") {
            setSignInFormData(initialSignInFormData);
        }
        if (tab === "signup") {
            setSignUpFormData(initialSignUpFormData);
        }
        setActiveTab(tab);
        // console.log(tab);

    }
    function checkIfsignInValid() {
        if (signInFormData && signInFormData.userEmail && signInFormData.password) {
            return true;
        }
        return false;
    }
    function checkIfsignUPValid(){
        if (signUpFormData && signUpFormData.userName && signUpFormData.userEmail && signUpFormData.password) {
            return true;
        }
        return false;
    }
    // console.log(signInFormData);
    return (
        <div className="flex flex-col min-h-screen">
            <header className="px-4 lg:px-5 h-15 flex items-center border-b">
                <Link to={"/"} className="flex items-center justify-center">
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold text-xl">LEARNLY</span>

                </Link>

            </header>
            <div className="flex items-center justify-center min-h-screen bg-background ">
                <Tabs defaultValue="signin" value={activeTab}
                    onValueChange={handelTabChange}
                    className="w-full max-w-md">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">sign in</TabsTrigger>
                        <TabsTrigger value="signup">sign up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signin">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Signin</CardTitle>
                                <CardDescription>Enter your email and password to signin</CardDescription>

                            </CardHeader>
                            <CardContent className="space-y-2">
                               <CommonForm formControls={signinFormControls} buttonText="sign in" formData={signInFormData}
                               setFormData={setSignInFormData}
                               isButtonDisabled={!checkIfsignInValid()}
                               handelSubmit={handelLoginUser}
                                />

                            </CardContent>
                            
                        </Card>
                    </TabsContent>
                    <TabsContent value="signup">
                        <Card className="p-6 space-y-4">
                            <CardHeader>
                                <CardTitle>Signup</CardTitle>
                                <CardDescription>create an account for best learning platform</CardDescription>

                            </CardHeader>
                            <CardContent className="space-y-2">
                               <CommonForm formControls={signUpFormControls} buttonText="sign up" formData={signUpFormData}
                               setFormData={setSignUpFormData}
                                 isButtonDisabled={!checkIfsignUPValid()}
                                 handelSubmit={handelRegisterUser} />
                            </CardContent>
                            
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default AuthPage;