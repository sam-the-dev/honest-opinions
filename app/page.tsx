"use client";

import ExampleMessageCard from "@/components/ExampleMessageCard";
import Navbar from "@/components/Navbar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const defaultMessages = [
  {
    key: 0,
    title: "Message from your Crush",
    message: "Hey, I've started to like you !",
    time: "10 minutes ago",
  },
  {
    key: 1,
    title: "Message from your Secret Admirer",
    message: "Bro, you're doing an amazing work !",
    time: "1 hour ago",
  },
  {
    key: 2,
    title: "Message from Anonymous User",
    message: "What's the last movie you watched?",
    time: "30 minutes ago",
  },
];

export default function Home() {
  return (
    <>
      <main className="w-full min-h-screen bg-myblue">
        <Navbar />
        <section className="flex flex-col items-center justify-center py-20">
          <h1 className="text-myskin xl:text-7xl md:text-5xl sm:text-4xl text-4xl font-bold text-center font-poppins">
            Unlock Honest Conversations
          </h1>
          <p className="md:text-xl sm:text-lg text-base text-myskin my-4 font-poppins tracking-wide text-center">
            Honest Opinions - Connect with people without revealing your
            identity !
          </p>

          <Carousel
            className="w-full max-w-2xl p-16"
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
          >
            <CarouselContent className="">
              {defaultMessages.map((message) => (
                <CarouselItem key={message.key} className="">
                  <ExampleMessageCard
                    title={message.title}
                    message={message.message}
                    time={message.time}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </main>
    </>
  );
}


