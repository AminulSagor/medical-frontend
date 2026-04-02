"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CourseAboutAndInfo from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-about-and-info";
import CourseDetailsHeroSection from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-details-hero-section";
import CourseInstructors from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-instructors";
import CourseItinerary from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-itinerary";
import CoursePricingCard from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-pricing-card";
import CourseTrustedByRow from "@/app/(user)/(not-register)/public/(pages)/courses/_components/course-trusted-by-row";
import { CourseDetails } from "@/app/public/types/course.details.types";
import { getPublicWorkshopById } from "@/service/public/workshop.service";
import { transformWorkshopToDetails } from "@/utils/workshop/transform-workshop-details";
import { IMAGE } from "@/constant/image-config";

export default function WorkshopDetailsPage() {
  const params = useParams();
  const workshopId = params.courseId as string;

  const [data, setData] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setLoading(true);
        const response = await getPublicWorkshopById(workshopId);
        const transformed = transformWorkshopToDetails(response.data);
        setData(transformed);
      } catch (err) {
        console.error("Failed to fetch workshop details:", err);
        setError("Failed to load workshop details");
      } finally {
        setLoading(false);
      }
    };

    if (workshopId) {
      fetchWorkshop();
    }
  }, [workshopId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-red-500">
          {error || "Workshop not found"}
        </p>
      </div>
    );
  }

  return (
    <div>
      <CourseDetailsHeroSection
        title={data.hero.title}
        backgroundSrc={data.hero.backgroundSrc || IMAGE.course_details_cover}
        badges={data.hero.badges}
      />
      <div className="padding py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <CourseAboutAndInfo data={data} />
            <CourseItinerary data={data} />
            <CourseInstructors data={data} />
            <CourseTrustedByRow data={data} />
          </div>

          <div className="lg:sticky lg:top-28 h-fit">
            <CoursePricingCard data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
