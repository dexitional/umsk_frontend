import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageTitle from "../../components/las/PageTitle";
import { useUserStore } from "../../utils/authService";
import { useLoaderData, useNavigate } from "react-router";
import PgEvaluationReceipt from "./PgEvaluationReceipt";
const { REACT_APP_API_URL } = import.meta.env;


// Every evaluation form (course/sts/ims/any future one) is tied to the
// student's registered courses and an assessor (staff) for that course —
// `formKey` (from the route, defaults to 'course') just changes which
// question set / course-evaluation-window applies; the flow itself
// (pick a course, pick an assessor, answer the form's questions) is shared.
export async function loader({ params }) {
  const user = useUserStore.getState().user;
  const formKey = params?.formKey || "course";
  const authHeaders = { "x-access-token": localStorage.getItem("@Auth:token") || "" };
  try {
    const [formsRes, staffRes, questionsRes, optionsRes, guidesRes] =
      await Promise.all([
        fetch(`${REACT_APP_API_URL}/eva/data/${encodeURIComponent(user?.user?.tag)}?form=${encodeURIComponent(formKey)}`, { headers: authHeaders }),
        fetch(`${REACT_APP_API_URL}/eva/staff`, { headers: authHeaders }),
        fetch(`${REACT_APP_API_URL}/eva/questions?form=${encodeURIComponent(formKey)}`, { headers: authHeaders }),
        fetch(`${REACT_APP_API_URL}/eva/options`, { headers: authHeaders }),
        fetch(`${REACT_APP_API_URL}/eva/guides?form=${encodeURIComponent(formKey)}`, { headers: authHeaders }),
      ]);

    let staff, questions, options, guides, courses, selectedCourses:any = [], courseEvaluations = {};
    if (staffRes.ok) staff = await staffRes.json();
    if (questionsRes.ok) questions = await questionsRes.json();
    if (optionsRes.ok) options = await optionsRes.json();
    if (guidesRes.ok) guides = await guidesRes.json();
    if (formsRes.ok)  courses = await formsRes.json();

    courses?.data?.map((course: any) => {
      if (!selectedCourses.find((c:any) => c.id === course.id)) {
        selectedCourses.push(course);
        courseEvaluations[`${course.id}`] =  {
          courseId: course.id,
          staffNo: "",
          responses: {},
        }
      }
    });

    console.log(courses)
    return { formKey, staff, questions, options, guides, courses, selectedCourses, courseEvaluations }

  } catch (error) {
    console.error("Error fetching data:", error);
    toast.error("Failed to load data");
  }
}


function PgCourseEvaluation() {

  const { formKey, staff, questions, options, guides, courses, selectedCourses, courseEvaluations: ce }: any = useLoaderData();
  const navigate = useNavigate();
  const { user } = useUserStore((state) => state);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    staffNo: "",
    indexno: user?.user?.tag,
    sessionId: "",
    responses: {} as Record<string, string>,
  });

  const [lecturerSearch, setLecturerSearch] = useState("");
  const [showLecturerOptions, setShowLecturerOptions] = useState(true);

  // Multi-course evaluation state
  const [currentCourseIndex, setCurrentCourseIndex] = useState(0);
  const [courseEvaluations, setCourseEvaluations] = useState<Record<string, any>>(ce);
  const [completedCourses, setCompletedCourses] = useState<Set<string>>(new Set());

  const switchToCourse = (index: number) => {
    setCurrentCourseIndex(index);
    const course = selectedCourses[index];
    if (course && courseEvaluations[course.id]) {
      setFormData({
        courseId: course.id,
        staffNo: courseEvaluations[course.id].staffNo || "",
        indexno: formData.indexno,
        sessionId: formData.sessionId,
        responses: courseEvaluations[course.id].responses || {},
      });
      setLecturerSearch(
        courseEvaluations[course.id].staffNo
          ? (staff as any[]).find(
              (s: any) => s.staffNo === courseEvaluations[course.id].staffNo
            )?.name || ""
          : ""
      );
    }
  };

  const saveCurrentCourseEvaluation = () => {
    if (selectedCourses[currentCourseIndex]) {
      const courseId = selectedCourses[currentCourseIndex].id;
      // Check For Unanswered Questions
      const evaluation = courseEvaluations[courseId];
      if (!evaluation || !evaluation.staffNo){
        toast.error(`Please Choose a Lecturer to Assess !`);
        return;
      }
      const unanswered = questions.filter((q) => q.required && !evaluation.responses[q.id.toString()] );
      if (unanswered.length > 0) {
        // toast.error(`PLEASE COMPLETE THE FOLLOWING:\n\n ${unanswered.map((c) => `${c.orderNum}. ${c.question}`).join(" \n\n")}`);
        toast.error(`Please Answer the Required QAs:\n\n ${unanswered.map((c) => `Q.${c.orderNum}`).join(" , ")}\n\n`);
        return;
      }
      // Save Responses
      setCourseEvaluations((prev) => ({
        ...prev,
        [courseId]: {
          courseId,
          staffNo: formData.staffNo,
          responses: formData.responses,
        },
      }));
      // Mark as Completed
      markCourseAsCompleted(courseId);
      // Switch Next Course
      switchToCourse(Math.min(currentCourseIndex+1,selectedCourses.length-1))
    }
  };

  const markCourseAsCompleted = (courseId: string) => {
    setCompletedCourses((prev) => new Set([...prev, courseId]));
  };

  const groupedQuestions = questions.reduce(
    (acc: Record<string, any[]>, q: any) => {
      if (!acc[q.category]) acc[q.category] = [];
      acc[q.category].push(q);
      return acc;
    },{}
  );

  const handleRadioChange = (questionId: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      responses: { ...prev.responses, [questionId.toString()]: value },
    }));

    // Auto-save current course evaluation when answers change
    setTimeout(() => {
      if (selectedCourses[currentCourseIndex]) {
        const courseId = selectedCourses[currentCourseIndex].id;
        setCourseEvaluations((prev) => ({
          ...prev,
          [courseId]: {
            courseId,
            staffNo: formData.staffNo,
            responses: {
              ...formData.responses,
              [questionId.toString()]: value,
            },
          },
        }));
      }
    }, 500); // Debounce auto-save
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCourses.length === 0) {
      toast.error("Please add at least one course to evaluate");
      return;
    }
    // Save current course evaluation before submitting
    saveCurrentCourseEvaluation();
    // // Validate all selected courses have required data
    // const incompleteCourses = selectedCourses.filter((course) => {
    //   const evaluation = courseEvaluations[course.id];
    //   if (!evaluation || !evaluation.staffNo) return true;
    //   const unanswered = questions.filter(
    //     (q) => !evaluation.responses[q.id.toString()]
    //   );
    //   return unanswered.length > 0;
    // });

    // if (incompleteCourses.length > 0) {
    //   toast.error(
    //     `Please complete evaluations for: ${incompleteCourses
    //       .map((c) => c.title)
    //       .join(", ")}`
    //   );
    //   return;
    // }

    try {
      // Submit all course evaluations
      const submissionPromises = selectedCourses.map(async (course) => {
        const evaluation = courseEvaluations[course.id];
        return fetch(`${REACT_APP_API_URL}/eva/evaluations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("@Auth:token") || "",
          },
          body: JSON.stringify({
            form: formKey,
            courseId: evaluation.courseId,
            staffNo: evaluation.staffNo,
            indexno: formData.indexno,
            sessionId: formData.sessionId,
            responses: evaluation.responses,
          }),
        });
      });

      const responses = await Promise.all(submissionPromises);
      const failedCount = responses.filter((r) => !r.ok).length;

      if (failedCount === 0) {
        toast.success(
          `${formLabel} evaluation completed — all ${selectedCourses.length} course(s) submitted!`
        );
        // Every registered course for this form has now been submitted, so
        // this is the final completion — send the student back to the
        // evaluation list, where this form now shows as completed with a
        // link to print/view the receipt (this page itself would also show
        // the receipt if revisited directly, since courses.status flips to
        // 'completed' once the loader re-fetches).
        navigate("/aisp/evaluation");
      } else {
        toast.error(
          `${failedCount} evaluation(s) failed to submit. Please try again.`
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit evaluations");
    }
  };

  const formLabel = formKey === "course" ? "Course" : formKey?.toUpperCase();

  // Return  Evaluation Printout
  if(courses.status == 'completed')
    return (
      <div className="p-4 md:p-6 space-y-4 md:space-y-2">
         <PageTitle
            title="Evaluation Receipt"
            createtext=""
            createlink=""
            setView={() => null}
            view={""}
          />
         <PgEvaluationReceipt data={courses?.data} title={`${formLabel} EVALUATION RECEIPT`}/>
     </div>
)
  // Return an explanatory message instead of a blank page whenever there's
  // nothing to evaluate — either no assessed/registered courses yet this
  // semester, or the evaluation window hasn't opened.
  if (selectedCourses.length === 0) {
    const message =
      courses.status === "not started"
        ? "Course evaluation for this semester has not opened yet. Please check back later."
        : courses.status === "not registered"
        ? "You have no registered courses for the active semester, so there is nothing to evaluate right now."
        : "No courses are currently available for evaluation.";
    return (
      <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
        <PageTitle
          title="Student Course Evaluation"
          createtext=""
          createlink=""
          setView={() => null}
          view={""}
        />
        <div className="p-10 border rounded-xl flex flex-col items-center justify-center space-y-2 text-center">
          <span className="text-gray-500 font-medium">{message}</span>
        </div>
      </div>
    );
  }
  // Return Evaluation Form
  if(courses.status == 'started')
  return (
    <div className="md:pl-10 p-4 md:p-6 space-y-4 md:space-y-10">
      <PageTitle
        title={formKey === "course" ? "Student Course Evaluation" : `${formLabel} Evaluation`}
        createtext=""
        createlink=""
        setView={() => null}
        view={""}
      />

      {guides?.length > 0 && (
        <div className="space-y-3">
          {guides.map((g: any) => (
            <div key={g.id} className="p-4 border rounded-xl bg-primary/5 space-y-1">
              {g.title && <h3 className="text-sm font-semibold text-primary">{g.title}</h3>}
              <p className="text-xs md:text-sm text-slate-500 whitespace-pre-wrap">{g.description}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Course Selection */}
        <div className="space-y-4">
          {/* Selected Courses List */}
          {selectedCourses.length > 0 && (
            <div>
              <h3 className="text-md font-noto font-medium text-primary-dark mb-3">
                YOU HAVE ( {selectedCourses.length} ) COURSES TO EVALUATE
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {selectedCourses.map((course, index) => (
                  <div
                    key={course.id}
                    className={`flex items-center justify-between p-3 border rounded-md  text-xs md:text-sm ${
                      currentCourseIndex === index
                        ? "font-semibold text-secondary-accent border-secondary-accent bg-secondary-accent/10"
                        : "text-gray-500 border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={() => switchToCourse(index)}
                        className="font-bold text-xs font-noto"
                      >
                        {course.title} - ({course.id})
                      </button>
                      {completedCourses.has(course.id) && (
                        <div className="w-7 px-2 py-1 rounded-full font-noto text-xs font-medium bg-green-100 text-green-800">
                          ✓ 
                        </div>
                      )}
                    </div>
                    {/* <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button> */}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Current Course Evaluation */}
        {selectedCourses.length > 0 && (
          <div className="border-y-4 border-dashed py-6">
            <div className="px-3 py-2 rounded-md flex flex-col md:flex-row items-center md:justify-between md:space-y-0 space-y-3 mb-4 bg-primary/5 shadow-[0px_0px_4px_#ccc_inset]">
              <h2 className="md:text-lg font-noto font-semibold text-primary/80">
                {selectedCourses[currentCourseIndex]?.title} - (
                {selectedCourses[currentCourseIndex]?.id})
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Course {currentCourseIndex + 1} of {selectedCourses.length}
                </span>
                {currentCourseIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => switchToCourse(Math.max(currentCourseIndex - 1,0))}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Previous
                  </button>
                )}
                {currentCourseIndex < selectedCourses.length - 1 && (
                  <button
                    type="button"
                    onClick={() => switchToCourse(Math.min(currentCourseIndex+1, selectedCourses.length-1 ))}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tutor or Course Administrator</label>
                <div className="relative">
                  <input
                    type="text"
                    value={lecturerSearch}
                    onChange={(e) => setLecturerSearch(e.target.value)}
                    onFocus={() => setShowLecturerOptions(true)}
                    placeholder={
                      loading
                        ? "Loading staff..."
                        : "Search and choose from list of lecturer"
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  {showLecturerOptions && lecturerSearch && (
                    <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {staff
                        .filter(
                          (member: any) =>
                            member.name
                              .toLowerCase()
                              .includes(lecturerSearch.toLowerCase()) ||
                            member.staffNo
                              .toString()
                              .toLowerCase()
                              .includes(lecturerSearch.toLowerCase())
                        )
                        .map((member: any) => (
                          <div
                            key={member.staffNo}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                staffNo: member.staffNo,
                              }));
                              setLecturerSearch(member.name);
                              setShowLecturerOptions(false);
                            }}
                          >
                            {member.name}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions - Only show when courses are selected */}
        {selectedCourses.length > 0 &&
          Object.entries(groupedQuestions).map(
            ([category, categoryQuestions]: any) => (
              <div
                key={category}
                className="px-6 py-3 border rounded-xl space-y-6 "
              >
                <h2 className="text-lg font-roboto font-semibold text-primary/80 border-b pb-2 uppercase">
                  {category}
                </h2>
                {categoryQuestions.map((question: any) => (
                  <div key={question.id} className="space-y-3">
                    <p className="text-primary-dark font-medium">
                      {question.orderNum}. {question.question}
                    </p>
                    {question.type === "likert" ? (
                      <div className="flex flex-wrap gap-4">
                        {options.map((option: any) => (
                          <label
                            key={option.id}
                            className="flex items-center space-x-2 cursor-pointer italic"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option.option}
                              checked={formData.responses[question.id.toString()] === option.option}
                              onChange={() => handleRadioChange(question.id, option.option)}
                              className="w-4 h-4 text-secondary-accent focus:ring-secondary-accent"
                            />
                            <span className="text-sm text-gray-700">
                              {option.option}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        name={`question-${question.id}`}
                        value={formData.responses[question.id.toString()] || ""}
                        onChange={(e) =>
                          handleRadioChange(question.id, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        placeholder="Your answer..."
                      />
                    )}
                  </div>
                ))}
              </div>
            )
          )}

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          {selectedCourses.length > 0 && (
            <div className="flex flex-col md:flex-row justify-center md:space-y-0 space-y-3 md:space-x-4">
              { (currentCourseIndex < selectedCourses.length - 1) && (
              <button
                type="button"
                onClick={saveCurrentCourseEvaluation}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Save Current Responses ({selectedCourses[currentCourseIndex]?.id})
              </button>
              )}

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Submit All Evaluations ({selectedCourses.length} courses)
              </button>
            </div>
          )}

          {/* Progress Summary */}
          {selectedCourses.length > 0 && (
            <div className="text-sm text-gray-600">
              Progress: {completedCourses.size} of {selectedCourses.length}{" "}
              courses completed
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      (completedCourses.size / selectedCourses.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

export default PgCourseEvaluation;
