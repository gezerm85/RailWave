import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchResults from "../pages/SearchResults";
import PassengerInfo from "../pages/PassengerInfo";
import Payment from "../pages/Payment";
import Ticket from "../pages/Ticket";
import LoginRegister from "../pages/LoginRegister.jsx";
import MyTickets from "../pages/MyTickets.jsx";
import AdminPanel from "../pages/AdminPanel";
import Layout from "../Layout.jsx";
import TicketDetail from "../pages/TicketDetail.jsx";
import SeatSelection from "../pages/SeatSelection.jsx";
import Stations from "../pages/admin/Stations.jsx";
import Employees from "../pages/employees/Employees.jsx";
import Trains from "../pages/admin/Trains.jsx";
import Trips from "../pages/admin/Trips.jsx";
import AdminTickets from "../pages/admin/AdminTickets.jsx";
import UserDashboard from "../pages/UserDashboard";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage.jsx";
import ResetPassword from "../pages/ResetPassword.jsx";

import RoleRoute from "../components/RoleRoute.jsx";
import Terms from "../pages/Terms.jsx";
import Support from "../pages/Support.jsx";
import Privacy from "../pages/Privacy.jsx";
import ForgotPassword from "../pages/ForgotPassword.jsx";
import Profile from "../pages/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/", element: <LoginRegister /> },
      { path: "/login", element: <LoginRegister /> },
      { path: "/register", element: <LoginRegister /> },
      { path: "*", element: <NotFoundPage /> },
      { path: "/reset-password", element: <ResetPassword /> },
      { path: "/terms", element: <Terms />, },
      { path: "/support", element: <Support />, },
      { path: "/privacy", element: <Privacy />, },

      {
        path: "/user",
        element: (
          <RoleRoute allowedRoles={["USER"]}>
            <UserDashboard />
          </RoleRoute>
        ),
      },
      {
        path: "/search-results",
        element: (
          <RoleRoute allowedRoles={["USER"]}>
            <SearchResults />
          </RoleRoute>
        ),
      },
      {
        path: "/passenger",
        element: (
          <RoleRoute allowedRoles={["USER"]}>
            <PassengerInfo />
          </RoleRoute>
        ),
      },
      {
        path: "/payment",
        element: (
          <RoleRoute allowedRoles={["USER"]}>
            <Payment />
          </RoleRoute>
        ),
      },
      {
        path: "/ticket",
        element: (
          <RoleRoute allowedRoles={["USER"]}>
            <Ticket />
          </RoleRoute>
        ),
      },
      {
        path: "/seat-selection",
        element: (
          <RoleRoute allowedRoles={["USER"]}>
            <SeatSelection />
          </RoleRoute>
        ),
      },
      {
        path: "/tickets",
        element: (
          <RoleRoute allowedRoles={["USER"]}>
            <MyTickets />
          </RoleRoute>
        ),
      },

      {
        path: "/ticket/:id",
        element: (
          <RoleRoute allowedRoles={["USER", "ADMIN"]}>
            <TicketDetail />
          </RoleRoute>
        ),
      },

      {
        path: "/admin",
        element: (
          <RoleRoute allowedRoles={["ADMIN"]}>
            <AdminPanel />
          </RoleRoute>
        ),
      },
      {
        path: "/admin/stations",
        element: (
          <RoleRoute allowedRoles={["ADMIN"]}>
            <Stations />
          </RoleRoute>
        ),
      },
      {
        path: "/admin/trains",
        element: (
          <RoleRoute allowedRoles={["ADMIN"]}>
            <Trains />
          </RoleRoute>
        ),
      },
      {
        path: "/admin/trips",
        element: (
          <RoleRoute allowedRoles={["ADMIN"]}>
            <Trips />
          </RoleRoute>
        ),
      },
      {
        path: "/admin/AdminTickets",
        element: (
          <RoleRoute allowedRoles={["ADMIN"]}>
            <AdminTickets />
          </RoleRoute>
        ),
      },

      {
        path: "/manager/employees",
        element: (
          <RoleRoute allowedRoles={["MANAGER"]}>
            <AdminPanel />
          </RoleRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <RoleRoute allowedRoles={["MANAGER", "USER", "ADMIN"]}>
            <Profile />
          </RoleRoute>
        ),
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
