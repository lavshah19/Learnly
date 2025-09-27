import { GraduationCap, TvMinimalPlay, Menu, X } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from "@/context/auth-context";

const StudentViewHeaderComponent = () => {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handelLogout() {
    resetCredentials();
    sessionStorage.clear();
  }
  return (
    <header className="flex items-center justify-between p-2 md:p-4 border-b relative">
      <div className="flex items-center space-x-2 md:space-x-4">
        <Link to="/" className="flex items-center hover:text-black">
          <GraduationCap className="h-6 w-6 md:h-8 md:w-8" />
          <span className="font-extrabold text-sm md:text-xl">LEARNLY</span>
        </Link>
        <div className="hidden md:flex items-center space-x-1">
          <Button
            onClick={() => {
              location.pathname.includes("/courses")
                ? null
                : navigate("/courses");
            }}
            className="text-sm md:text-base font-medium"
          >
            Explore Courses
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-4">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate("/student-courses")}
            className="cursor-pointer flex items-center gap-3"
          >
            <span className="font-extrabold text-xl">My Courses</span>
            <TvMinimalPlay className="h-8 w-8 cursor-pointer" />
          </div>
        </div>
        <Button onClick={handelLogout} className="text-base">
          Logout
        </Button>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2"
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50 md:hidden transition-all duration-300 ease-in-out">
          <div className="p-4 space-y-3">
            <Button
              onClick={() => {
                location.pathname.includes("/courses")
                  ? null
                  : navigate("/courses");
                setIsMenuOpen(false);
              }}
              className="w-full justify-start text-sm font-medium"
              variant="ghost"
            >
              Explore Courses
            </Button>
            <div
              onClick={() => {
                navigate("/student-courses");
                setIsMenuOpen(false);
              }}
              className="cursor-pointer flex items-center gap-3 p-2 rounded hover:bg-gray-100"
            >
              <TvMinimalPlay className="h-6 w-6" />
              <span className="font-extrabold text-sm">My Courses</span>
            </div>
            <Button
              onClick={() => {
                handelLogout();
                setIsMenuOpen(false);
              }}
              className="w-full justify-start text-sm"
              variant="ghost"
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default StudentViewHeaderComponent;
