import { Outlet } from "react-router-dom";
import Logo from "@/components/logo/logo";

const BaseLayout = () => {
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full mx-auto h-auto">
          <div className="flex justify-center gap-2 p-6 md:justify-start">
            <Logo url="/" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;