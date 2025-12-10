import { auth } from "@/lib/auth";
import { getCourses, getAllCourses } from "@/app/actions/courses";
import LanguageCoursesSection from "@/components/LanguageCoursesSection";

export default async function HomePage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  
  const result = isAdmin ? await getAllCourses() : await getCourses();
  const courses = result.success && result.courses ? result.courses : [];

  return (
    <div className="min-h-screen pb-20">
      <LanguageCoursesSection courses={courses} isAdmin={isAdmin} />
    </div>
  );
}