import CallToAction from "@/sections/CallToAction";
import Companies from "@/sections/Companies";
import Footer from "@/sections/Footer";
import Header from "@/sections/Header";
import Hero from "@/sections/Hero";
import News from "@/sections/News";
import Testimonials from "@/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Companies />
      <News />
      <Testimonials />
      <CallToAction />
      <Footer />
    </>
  );
}

