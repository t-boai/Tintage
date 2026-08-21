import HomeS1 from "@/app/(main)/(pages)/(home)/(HomeS1)/home-s1";
import HomeS2 from "@/app/(main)/(pages)/(home)/home-s2";
import HomeS3 from "@/app/(main)/(pages)/(home)/home-s3";
import HomeS4 from "@/app/(main)/(pages)/(home)/home-s4";
import HomeS5 from "@/app/(main)/(pages)/(home)/home-s5";
import HomeS6 from "@/app/(main)/(pages)/(home)/home-s6";

export default function Home() {
  return (
    <main className="mt-[5vh]">
      <HomeS1 />
      <HomeS2 />
      <HomeS3 />
      <HomeS4 />
      <HomeS5 />
      <HomeS6 />
    </main>
  );
}
