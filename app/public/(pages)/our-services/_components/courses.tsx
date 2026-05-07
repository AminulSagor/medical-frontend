"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { getPublicWorkshops } from "@/service/public/workshop.service";
import type { PublicWorkshop } from "@/types/public/workshop/public-workshop.types";

const DEFAULT_IMAGE = "/photos/course-placeholder.jpg";

type CourseItem = PublicWorkshop & {
  workshopPhoto?: string | null;
  title?: string | null;
  description?: string | null;
};

const stripHtml = (value?: string | null) => {
  if (!value) return "Explore this course to improve your clinical skills.";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const Courses = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const response = await getPublicWorkshops({
          page: 1,
          limit: 10,
        });

        setCourses(response.data || []);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-400 border-t-transparent" />
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="py-12">
        <p className="text-center text-sm text-slate-500">
          No courses available right now.
        </p>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-16">
      <div className="space-y-14 md:space-y-20">
        {courses.map((course, index) => {
          const reverse = index % 2 !== 0;
          const title = course.title || "Course Title";
          const description = stripHtml(course.description);
          const image = course.workshopPhoto || DEFAULT_IMAGE;

          return (
            <div
              key={course.id}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-12"
            >
              <div className={reverse ? "md:order-2" : ""}>
                <div className="h-[260px] w-full overflow-hidden md:h-[420px]">
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className={reverse ? "md:order-1" : ""}>
                <div className="max-w-xl">
                  <h2 className="text-xl font-bold text-black md:text-2xl">
                    {title}
                  </h2>

                  <p className="mt-4 line-clamp-5 text-sm leading-7 text-slate-700 md:text-base">
                    {description}
                  </p>

                  <Link
                    href={`/public/courses/details/${course.id}`}
                    className="mt-5 inline-flex items-center justify-center bg-sky-300 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-400"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Courses;
