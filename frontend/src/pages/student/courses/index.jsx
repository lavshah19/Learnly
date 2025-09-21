import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const StudentViewCoursesPage = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  // const [isFilterLoaded, setIsFilterLoaded] = useState(false);
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
    setCurrentCourseDetailsId,
  } = useContext(StudentContext);
  const { authUser: auth } = useContext(AuthContext);
  function handelFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    // console.log(
    //   indexOfCurrentSection,
    //   "indexOfCurrentSection",
    //   getSectionId,
    //   getCurrentOption
    // );

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );
      if (indexOfCurrentOption > -1) {
        cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
      } else {
        cpyFilters[getSectionId].push(getCurrentOption.id);
      }
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("Filters", JSON.stringify(cpyFilters));
  }
  async function fetchAllStutendtViewCourses() {
    try {
      const query = new URLSearchParams({
        ...filters,
        sortBy: sort,
      });
      const response = await fetchStudentViewCourseListService(query);
      if (response?.success) {
        setStudentViewCoursesList(response?.data);
        setLoadingState(false);
        // console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(","); // join will convert array to string

        queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }

    return queryParams.join("&");
  }

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null) {
      fetchAllStutendtViewCourses(filters, sort);
    }
  }, [filters, sort]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("Filters")) || {});
    //  setIsFilterLoaded(true); // mark filters as loaded
  }, []);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("Filters");
    };
  }, []);

  async function handleCourseNavigate(getCurrentCourseId) {
    try {
      const response = await checkCoursePurchaseInfoService(
        getCurrentCourseId,
        auth?.user?.userId
      );

      if (response?.success) {
        if (response?.data) {
          setCurrentCourseDetailsId(null);
          navigate(`/course-progress/${getCurrentCourseId}`);
        } else {
          setCurrentCourseDetailsId(null);
          navigate(`/course/details/${getCurrentCourseId}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="container mx-auto p-2">
      <h1 className="text-3xl font-bold mb-4">All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <aside className="w-full md:w-64  ">
          <div className=" px-3">
            {Object.keys(filterOptions).map((filterKey) => (
              <div key={filterKey} className=" space-y-4 mb-2 border-b p-2">
                <h3 className="font-bold mb-3 ">{filterKey.toUpperCase()}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[filterKey].map((filterOption) => (
                    <Label
                      key={filterOption.id}
                      className="flex font-medium items-center gap-3 "
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[filterKey] !== undefined &&
                          filters[filterKey].indexOf(filterOption.id) > -1
                        }
                        onCheckedChange={() =>
                          handelFilterOnChange(filterKey, filterOption)
                        }
                      />
                      {filterOption.label}
                    </Label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
        <main className="flex-1 ">
          <div className="flex justify-end items-center mb-4 gap-5 ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size={"sm"}
                  className={"flex items-center gap-1"}
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={"w-[170px]"}>
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.length > 0 &&
                    sortOptions.map((sortOption) => (
                      <DropdownMenuRadioItem
                        value={sortOption.id}
                        key={sortOption.id}
                      >
                        {sortOption.label}
                      </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-muted-foreground font-bold">
              {studentViewCoursesList.length} results
            </span>
          </div>
          <div className="space-y-4">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <Card
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="cursor-pointer"
                  key={courseItem?._id}
                >
                  <CardContent className="flex gap-4 p-4">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={courseItem?.image}
                        className="w-ful h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {courseItem?.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mb-1">
                        Created By{" "}
                        <span className="font-bold">
                          {courseItem?.instructorName}
                        </span>
                      </p>
                      <p className="text-[16px] text-gray-600 mt-3 mb-2">
                        {`${courseItem?.curriculum?.length} ${
                          courseItem?.curriculum?.length <= 1
                            ? "Lecture"
                            : "Lectures"
                        } - ${courseItem?.level.toUpperCase()} Level`}
                      </p>
                      <p className="font-bold text-lg">
                        Rs {courseItem?.pricing}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : loadingState ? (
              <Skeleton />
            ) : (
              <p className="text-center font-bold">No courses found.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentViewCoursesPage;
