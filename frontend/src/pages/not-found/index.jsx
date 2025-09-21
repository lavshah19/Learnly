import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Card className="w-full max-w-md text-center shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-red-500">404</CardTitle>
          <CardDescription className="text-lg">
            Oops! The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
