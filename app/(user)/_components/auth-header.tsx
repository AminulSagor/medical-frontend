// // app/(auth)/_components/auth-header.tsx
// import Image from "next/image";
// import Link from "next/link";

// export default function AuthHeader() {
//   return (
//     <header className="sticky top-0 z-30 w-full bg-slate-50/70 backdrop-blur">
//       <div className="mx-auto max-w-6xl px-3 py-3">
//         <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-1 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
//           {/* LEFT LOGO */}
//           <Link href="/" className="flex items-center gap-1">
//             <div className="relative h-10 w-10 shrink-0">

//               <Image
//                 src="/icons/plus_button.png"
//                 alt="Add"
//                 fill
//                 sizes="40px"
//                 className="object-contain translate-x-[1px] translate-y-[-1px]"
//                 priority
//               />
//             </div>


//             <div className="leading-none">
//               <div className="text-sm font-semibold text-slate-900">
//                 Texas Airway
//               </div>
//               <div className="text-[10px] tracking-[0.12em] text-[#32C4F3]">
//                 INSTITUTE
//               </div>
//             </div>
//           </Link>

//           {/* SEARCH */}
//           <div className="relative ml-2 flex-1">
//             <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
//               ⌕
//             </span>
//             <input
//               className="h-9 w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
//               placeholder="Search courses, products, or articles..."
//             />
//           </div>

//           {/* NAV */}
//           <nav className="hidden items-center gap-5 lg:flex">
//             <Link className="text-xs text-slate-700 hover:text-slate-900" href="#">
//               Courses
//             </Link>
//             <Link className="text-xs text-slate-700 hover:text-slate-900" href="#">
//               Store
//             </Link>
//             <Link className="text-xs text-slate-700 hover:text-slate-900" href="#">
//               Blogs
//             </Link>
//             <Link className="text-xs text-slate-700 hover:text-slate-900" href="#">
//               About Us
//             </Link>
//             <Link className="text-xs text-slate-700 hover:text-slate-900" href="#">
//               Contacts
//             </Link>
//           </nav>

//           {/* Divider */}
//           <div className="hidden h-6 w-px bg-slate-200 lg:block" />

//           {/* RIGHT */}
//           <div className="flex items-center gap-2">
//             <button
//               type="button"
//               aria-label="Cart"
//               className="relative grid h-9 w-9 place-items-center rounded-full bg-white hover:bg-slate-50"
//             >
//               <Image
//                 src="/icons/cart_button.png"
//                 alt="Cart"
//                 width={24}
//                 height={24}
//                 className="h-6 w-6"
//               />
//             </button>

//             <button
//               type="button"
//               aria-label="Profile"
//               className="relative grid h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-white"
//             >
//               <Image
//                 src="/icons/user_profile.png"
//                 alt="User"
//                 width={36}
//                 height={36}
//                 className="h-9 w-9 object-cover"
//                 priority
//               />
//               <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#32C4F3] ring-2 ring-white" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }
