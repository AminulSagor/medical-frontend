"use client";

import Button from "@/components/buttons/button";
import { MapPin, Clock, Navigation, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AboutCtaVisit() {
  const address = {
    name: "Texas Airway Institute",
    street: "1234 Medical Center Dr, Suite 500",
    city: "Houston",
    state: "TX",
    zip: "77030",
    phone: "(713) 555-0123",
    lat: 29.7075,
    lng: -95.4016,
  };

  // OpenStreetMap embed URL (no API key required!)
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${address.lng - 0.02},${address.lat - 0.02},${address.lng + 0.02},${address.lat + 0.02}&layer=mapnik&marker=${address.lat},${address.lng}`;

  return (
    <section className="py-24">
      <div className="padding">
        {/* top CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h3
            className="font-serif text-[44px] font-bold text-black"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
          >
            Ready to master the airway?
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-3 text-sm text-light-slate/65"
          >
            Join Dr. Enoh at the Texas Airway Institute and elevate your
            practice.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="sm"
              variant="primary"
              shape="pill"
              className="px-6 py-4"
            >
              <Link href="/public/courses">Explore Courses</Link>
            </Button>
            <Link href="/public/contact-us">
              <Button
                size="sm"
                variant="secondary"
                shape="pill"
                className="px-6 py-4"
              >
                Contact Dr. Enoh
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* visit grid */}
        <div className="mt-16 grid items-start gap-10 lg:grid-cols-2">
          {/* LEFT SIDE - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.h4
              className="text-lg font-bold text-black"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              Visit Our Center
            </motion.h4>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-3 max-w-[58ch] text-sm leading-6 text-light-slate/70"
            >
              Located in the heart of the medical district, our 15,000 sq. ft.
              facility is easily accessible and designed to host large workshops
              and intimate training sessions alike.
            </motion.p>

            <div className="mt-8 space-y-6">
              {/* Address */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="flex gap-4 group cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <div className="mt-1 text-primary">
                  <MapPin size={18} strokeWidth={2} />
                </div>

                <div>
                  <div className="font-semibold text-black">{address.name}</div>
                  <div className="text-xs text-light-slate/60">
                    {address.street}
                  </div>
                  <div className="text-xs text-light-slate/60">
                    {address.city}, {address.state} {address.zip}
                  </div>
                  <motion.a
                    href={`https://www.openstreetmap.org/?mlat=${address.lat}&mlon=${address.lng}#map=16/${address.lat}/${address.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-primary/70 hover:text-primary transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Navigation size={10} />
                    Get Directions
                  </motion.a>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="flex gap-4"
              >
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
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75, duration: 0.5 }}
                className="flex gap-4"
              >
                <div className="mt-1 text-primary">
                  <Phone size={18} strokeWidth={2} />
                </div>

                <div>
                  <div className="font-semibold text-black">Call Us</div>
                  <a
                    href={`tel:${address.phone}`}
                    className="text-xs text-light-slate/60 hover:text-primary transition-colors"
                  >
                    {address.phone}
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT SIDE - OpenStreetMap - FIXED ROTATION */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.34, 1.2, 0.64, 1],
            }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[18px] border border-light-slate/10 bg-white shadow-lg group">
              {/* Map Container */}
              <div className="relative h-[260px] w-full md:h-[320px] bg-gray-100">
                <iframe
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="absolute inset-0"
                  title="Texas Airway Institute Location on OpenStreetMap"
                />
              </div>

              {/* Animated overlay gradient on hover */}
              <motion.div
                className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/5 via-transparent to-transparent"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Floating map pin indicator */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{
                  delay: 0.6,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-[12px] bg-white shadow-md border border-light-slate/10 text-primary cursor-pointer hover:scale-110 transition-transform z-10"
                whileHover={{ rotate: 360 }}
                onClick={() => {
                  window.open(
                    `https://www.openstreetmap.org/?mlat=${address.lat}&mlon=${address.lng}#map=16/${address.lat}/${address.lng}`,
                    "_blank",
                  );
                }}
              >
                <MapPin size={18} strokeWidth={2} />
              </motion.div>

              {/* Pulsing location dot */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.6, 0, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/40 pointer-events-none"
              />
            </div>

            {/* Map caption */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-3 text-center text-[10px] text-light-slate/50"
            >
              Texas Medical Center, Houston — Click the pin for directions
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
