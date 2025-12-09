import { auth } from "@/lib/auth";
import { getCourseByLanguageCode, getAllPacksByCourse } from "@/app/actions/packs";
import PacksSection from "@/components/PacksSection";
import { notFound } from "next/navigation";

interface PacksPageProps {
  params: {
    languageCode: string;
  };
}

export default async function PacksPage({ params }: PacksPageProps) {
  const { languageCode } = params;
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  // Get course by language code
  const courseResult = await getCourseByLanguageCode(languageCode);
  
  if (!courseResult.success || !courseResult.course) {
    notFound();
  }

  const course = courseResult.course;

  // Get packs for this course
  const packsResult = await getAllPacksByCourse(course.id);
  const packs = packsResult.success && packsResult.packs ? packsResult.packs : [];

  return (
    <div className="min-h-screen pb-20">
      <PacksSection 
        packs={packs}
        courseId={course.id}
        courseName={course.title}
        languageCode={languageCode}
        isAdmin={isAdmin}
      />
    </div>
  );
}
