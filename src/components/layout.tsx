import { ReactNode } from "react";
import Header from "./header";
import TrendingTagsList from "./trending-tags-list";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <div className="min-h-screen grid grid-cols-[1fr_300px] max-w-[1100px] mx-auto gap-x-5 mt-5">
        <main>{children}</main>
        <TrendingTagsList />
      </div>
    </>
  );
}
