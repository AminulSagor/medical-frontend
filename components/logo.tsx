"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function NavbarLogo({
  href = "/public/home",
  title = "Texas Airway",
  subtitle = "INSTITUTE",
}: {
  href?: string;
  title?: string;
  subtitle?: string;
}) {
  const pathname = usePathname();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname === href) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <Link href={href} onClick={handleClick} className="flex items-center gap-3">
      <Image src={"/logo/logo-1.png"} height={200} width={130} alt="logo" />
    </Link>
  );
}
