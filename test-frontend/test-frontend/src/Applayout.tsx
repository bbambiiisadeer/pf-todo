import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";

const AppLayout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AppLayout;
