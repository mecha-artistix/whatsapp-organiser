import { useEffect, type JSX } from "react";
import socket from "./utils/socket";

import DashboardLayout from "./DashboardLayout.tsx";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Whatsapp from "./features/whatsapp/Whatsapp.tsx";

// wsl ip 172.23.243.156
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = true;

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/authentication/login" replace />
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute element={<DashboardLayout />} />,
    children: [{ path: "/whatsapp", element: <Whatsapp /> }],
  },
]);

function App() {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    socket.on("server_message", (server_message) =>
      console.log(server_message)
    );
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
