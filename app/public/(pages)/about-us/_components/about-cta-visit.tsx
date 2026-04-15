import Image from "next/image";
import Button from "@/components/buttons/button";
import { IMAGE } from "@/constant/image-config";
import { MapPin, Clock } from "lucide-react";

export default function AboutCtaVisit() {
  return (
    <section className="py-24">
      <div className="padding">
        {/* top CTA */}
        <div className="text-center">
          <h3 className="font-serif text-[44px] font-bold text-black">
            Ready to master the airway?
          </h3>

          <p className="mt-3 text-sm text-light-slate/65">
            Join Dr. Enoh at the Texas Airway Institute and elevate your
            practice.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="sm"
              variant="primary"
              shape="pill"
              className="px-6 py-4"
            >
              Explore Courses
            </Button>
            <Button
              size="sm"
              variant="secondary"
              shape="pill"
              className="px-6 py-4"
            >
              Contact Dr. Enoh
            </Button>
          </div>
        </div>

        {/* visit grid */}
        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div>
            <h4 className="text-lg font-bold text-black">Visit Our Center</h4>

            <p className="mt-3 max-w-[58ch] text-sm leading-6 text-light-slate/70">
              Located in the heart of the medical district, our 15,000 sq. ft.
              facility is easily accessible and designed to host large workshops
              and intimate training sessions alike.
            </p>

            <div className="mt-8 space-y-6">
              {/* Address */}
              <div className="flex gap-4">
                <div className="mt-1 text-primary">
                  <MapPin size={18} strokeWidth={2} />
                </div>

                <div>
                  <div className="font-semibold text-black">
                    Texas Airway Institute
                  </div>

                  <div className="text-xs text-light-slate/60">
                    1234 Medical Center Dr, Suite 500
                  </div>

                  <div className="text-xs text-light-slate/60">
                    Houston, TX 77030
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="mt-1 text-primary">
                  <Clock size={18} strokeWidth={2} />
                </div>

                <div>
                  <div className="font-semibold text-black">Hours</div>

                  <div className="text-xs text-light-slate/60">
                    Mon - Fri: 8:00 AM - 6:00 PM
                  </div>

                  <div className="text-xs text-light-slate/60">
                    Sat: By Appointment Only
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE MAP */}
          <div className="relative overflow-hidden rounded-[18px] border border-light-slate/10 bg-white shadow-sm">
            <div className="relative h-[260px] w-full md:h-[320px]">
              <Image
                src={IMAGE.doctor} // replace with map image later
                alt="Map"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>

            {/* Floating map pin */}
            <div className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-[12px] bg-white shadow-md border border-light-slate/10 text-primary">
              <MapPin size={18} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
