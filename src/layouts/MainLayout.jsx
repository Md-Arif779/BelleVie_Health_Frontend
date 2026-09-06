
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">

      {/* =========================================
          Top Navbar
      ========================================= */}

      <Navbar />

      {/* =========================================
          Dashboard Body
      ========================================= */}

      <div className="flex min-h-[calc(100vh-72px)]">

        {/* =========================================
            Sidebar
        ========================================= */}

        <Sidebar />

        {/* =========================================
            Main Content Area
        ========================================= */}

        <main
          className="
            flex-1
            min-w-0
            bg-[#F2F2F2]
            overflow-x-hidden
          "
        >
          <div
            className="
              w-full
              max-w-[1800px]
              mx-auto
              p-4
              sm:p-5
              lg:p-6
              xl:p-7
            "
          >
            <div className="bv-fade-in">
              <Outlet />
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;

