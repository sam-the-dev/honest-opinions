import { Mail } from "lucide-react";
import React from "react";

const ExampleMessageCard = ({
  title,
  message,
  time,
}: {
  title: string;
  message: string;
  time: string;
}) => {
  return (
    <div className="rounded-lg bg-gray-50 sm:w-[34rem] xs:w-[22rem] w-[16rem] xs:h-[10rem] h-[9rem] sm:min-h-[12rem] py-3 sm:px-10 p-5 flex justify-center flex-col mt-1 ">
      <h1 className="sm:text-3xl xs:text-xl text-base font-bold sm:mb-6 mb-3 font-poppins">
        {title}
      </h1>

      <div className="flex gap-2">
        <Mail size={30} />
        <div>
          <h2 className="sm:text-base xs:text-sm text-xs font-poppins">
            {message}
          </h2>
          <p className="sm:text-sm text-xs font-poppins">{time}</p>
        </div>
      </div>
    </div>
  );
};

export default ExampleMessageCard;
