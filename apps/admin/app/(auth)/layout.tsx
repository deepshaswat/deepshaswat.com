import React from "react";

import "@repo/ui/styles.css";
import { Navigation } from "../../components/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full flex dark:bg-[#1F1F1F]'>
      <Navigation />
      <main className='flex-1 h-full overflow-y-auto'>
        {/* <SearchCommand /> */}
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
