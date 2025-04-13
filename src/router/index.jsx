import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SearchResults from "../pages/SearchResults";
import PassengerInfo from "../pages/PassengerInfo";
import Payment from "../pages/Payment";
import Ticket from "../pages/Ticket";
import Login from "../pages/Login";
import Register from "../pages/Register";
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


import RoleRoute from "../components/RoleRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "*", element: <NotFoundPage /> },

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
            <Employees />
          </RoleRoute>
        ),
      },
      

    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
