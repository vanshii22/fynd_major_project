import React, { useContext } from "react";
import { Sidebar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Import Link from react-router-dom
import { HiChartPie, HiInbox, HiOutlineCloudUpload } from "react-icons/hi";
import { AiFillHome } from "react-icons/ai";
import { AuthContext } from "../contects/AuthProvider";

export const SideBar = () => {
  const { user, logOut } = useContext(AuthContext); // Combine multiple useContext calls
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";
  
  const handleLogout = () => {
    logOut()
      .then(() => {
        alert("Sign-out successfully!!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Sidebar aria-label="Sidebar with content separator example">
      <Sidebar.Logo
        as={Link} // Use 'as' prop to render as a Link component
        to="/" // Update this to your home path
        img={user?.photoURL}
        imgAlt="Budget Bookshelves logo"
        className="w-16 h-16"
      >
        <p>{user?.displayName || "Welcome User"}</p>
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item as={Link} to="/" icon={AiFillHome}>
            <p>Main Website</p>
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/user/dashboard" icon={HiChartPie}>
            <p>Dashboard</p>
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/user/dashboard/upload" icon={HiOutlineCloudUpload}>
            <p>Upload Book</p>
          </Sidebar.Item>
          <Sidebar.Item as={Link} to="/user/dashboard/manage" icon={HiInbox}>
            <p>Manage Books</p>
          </Sidebar.Item>
          <Sidebar.Item>
            <button
              className="bg-red-700 px-8 py-2 text-white rounded"
              onClick={handleLogout}
            >
              Logout
            </button>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};
