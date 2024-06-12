"use client";

import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
const Navbar = () => {
  const { data: session } = useSession();

  const user: User = session?.user as User;
  const router = useRouter();

  function handleButtonClick() {
    if (session && user) {
      signOut();
    } else {
      router.push("/login");
    }
  }

  return (
    <>
      <nav>
        <div className="w-full h-20 lg:px-24 md:px-16 sm:px-10 px-8 flex justify-between items-center bg-myskin">
          <h1 className="tracking-wide sm:text-2xl text-lg leading-[1.18rem] font-bold text-myblue font-poppins">
            <Link href="#">Honest Opinions</Link>
          </h1>

          <p className="tracking-wide sm:text-lg text-base font-medium text-myblue font-poppins">
            {user ? `Welcome, ${user.username || user.email}` : ""}
          </p>
          <button
            className="h-10 w-24 xs:text-base text-sm font-medium text-center bg-myblue text-myskin font-poppins rounded-lg hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-500 text-black tracking-wide"
            onClick={handleButtonClick}
          >
            {session && user ? "Logout" : "Login"}
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
