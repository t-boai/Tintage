// shad
import { Toaster } from "@/components/ui/toast";

// components
import Footer from "@/app/components/footer/footer";
import Header from "@/app/components/header/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto">{children}</main>
      <Toaster />
      <Footer />
    </div>
  );
}
