import Navbar from "@/components/Navbar";

export default function authLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen bg-myblue">
      <Navbar />
      {children}
    </main>
  );
}
