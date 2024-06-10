"use client";
import Link from "next/link";
import React from "react";

const error = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-red-600">
      <section className="flex items-center h-full p-16 tex">
        <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div className="max-w-md text-center">
            <h2 className="mb-8 font-extrabold text-4xl text-gray-50">
              Oops ! An Unexpected Error Occured
            </h2>
            <p className="mt-4 mb-8 text-gray-50">
              Here are some useful links:
            </p>
            <div className="flex gap-4">
              <Link
                href="/"
                className="w-[8rem] h-[3rem] flex items-center justify-center font-semibold rounded bg-gray-900 text-gray-50"
              >
                Back to homepage
              </Link>
              <Link
                href="/register"
                className="w-[8rem] h-[3rem] flex items-center justify-center font-semibold rounded bg-gray-900 text-gray-50"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="w-[8rem] h-[3rem] flex items-center justify-center font-semibold rounded bg-gray-900 text-gray-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default error;
