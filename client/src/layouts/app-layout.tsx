import Sidebar from "@/components/sidebar";
import { Outlet } from "react-router-dom";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";

const AppLayout = () => {
  return (
    <>
      <Sidebar>
        <Outlet />
      </Sidebar>
      <EditTransactionDrawer />
    </>
  );
};

export default AppLayout;