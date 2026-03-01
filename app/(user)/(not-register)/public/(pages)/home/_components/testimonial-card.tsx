"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Card from "@/components/cards/card";
import { Testimonial } from "@/app/(user)/(not-register)/public/types/testimonial.types";

function initialFromName(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "U";
  const parts = trimmed.split(" ").filter(Boolean);
  const last = parts[parts.length - 1] || trimmed;
  return last[0]?.toUpperCase() || "U";
}

export default function TestimonialCard({ item }: { item: Testimonial }) {
  const { author } = item;

  return (
    <Card
      shape="soft"
      className="h-full p-0 overflow-hidden border border-light-slate/15 shadow-sm"
    >
      <div className="flex h-full flex-col">
        {/* stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i < item.rating ? "text-yellow" : "text-light-slate/40"
              }
              fill={i < item.rating ? "currentColor" : "none"}
            />
          ))}
        </div>

        {/* quote */}
        <p className="mt-5 text-sm leading-relaxed text-light-slate italic">
          “{item.quote}”
        </p>

        {/* author (bottom) */}
        <div className="mt-auto pt-7 flex items-center gap-3">
          {/* avatar */}
          {author.avatarSrc ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-light-slate/15">
              <Image
                src={author.avatarSrc}
                alt={author.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="grid h-10 w-10 place-items-center rounded-full bg-light-slate/20 text-sm font-extrabold text-light-slate">
              {initialFromName(author.name)}
            </div>
          )}

          <div className="leading-tight">
            <p className="text-sm font-abold text-black">{author.name}</p>
            <p className="text-sm font-semibold text-light-slate">
              {author.role}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
