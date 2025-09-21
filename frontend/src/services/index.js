import axiosInstance from "@/api/axiosInstance";

export async function registerService(signUpFormData) {
  const response = await axiosInstance.post("/auth/register", {
    ...signUpFormData,
    role: "user",
  });
  return response.data;
}
export async function registeloginService(signInFormData) {
  const response = await axiosInstance.post("/auth/login", signInFormData);
  return response.data;
}
export async function checkAuthService() {
  const response = await axiosInstance.get("/auth/check-auth");
  return response.data;
}
export async function mediaUploadService(formData, onProgressCallback) {
  const response = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
      // console.log(percentCompleted);
    },
  });
  return response.data;
}
export async function mediaDeleteService(id, resourceType) {
  const response = await axiosInstance.delete(`/media/delete/${id}`, {
    params: { resourceType }, 
  });
  return response.data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function toggleCoursePublishService(id) {
  const { data } = await axiosInstance.put(
    `/instructor/course/toggle-publish/${id}`
  );

  return data;
}
export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);

  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function fetchStudentBoughtCoursesService() {
  const { data } = await axiosInstance.get(`/student/my-courses/get`);

  return data;
}

export async function createPaymentService(paymentPayload) {
  const { data } = await axiosInstance.post(
    `/student/payment/initiate-payment`,
    paymentPayload
  );

  return data;
}
export async function verifyPaymentAndUpdateStatusService(transaction_uuid) {
  const data = await axiosInstance.post(`/student/payment/payment-status`, {
    paymentId: transaction_uuid,
  });

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}
