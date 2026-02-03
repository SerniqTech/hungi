import { useRoutes } from "react-router";
import SamplePage from "./pages/sample-page";
import DashboardLayout from "./layout";

const Routes = () => {
  return useRoutes([
    {
      path: "/",
      element: (
        <DashboardLayout>
          <SamplePage />
        </DashboardLayout>
      ),
    },
    {
      path: "/home",
      element: (
        <DashboardLayout>
          <SamplePage />
        </DashboardLayout>
      ),
    },
  ]);
};

export default Routes;
