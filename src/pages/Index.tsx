import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { Seo } from "@/components/seo/Seo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="AIblty | Learn to Code, Build Apps & Master Tech Through Play"
        description="Learn coding, web development, AI, cybersecurity, data and game dev from absolute zero. 1,000+ interactive lessons and 30+ games for kids, teens and adults."
        path="/"
      />
      <Header />
      <HeroSection />
    </div>
  );
};

export default Index;
