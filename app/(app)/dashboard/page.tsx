import Dashboard from "@/components/Dashboard";
import React from "react";

const Page = async () => {
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return (
    <>
      <Dashboard baseUrl={baseUrl} />
    </>
  );
};

export default Page;
