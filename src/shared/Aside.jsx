import React, { useState } from "react";
import logo from "../assets/last_logo.svg";
import { GoSignOut } from "react-icons/go";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { LuBookOpen } from "react-icons/lu";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import "./Aside.css";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import ReactLoading from "react-loading";

export default function Aside() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  if (loading) {
    return (
      <ReactLoading type={"spin"} color={"white"} height={50} width={50} />
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (user) {
    return (
      <div>
        <RxHamburgerMenu className="toggle-button" onClick={toggleSidebar} />

        <aside className={`sidebar ${sidebarVisible ? "" : "hidden"}`}>
          <div className="profile">
            <img src={logo} alt="Profile Logo" />

            <div>
              <h4>
                <FaRegUser />
                <span style={{ marginLeft: "10px" }}>{user.displayName}</span>
              </h4>
            </div>
          </div>

          <div className="home-page" onClick={() => navigate("/home")}>
            <h4>
              Home <IoHomeOutline />
            </h4>
          </div>

          <div className="about-page" onClick={() => navigate("/about")}>
            <h4>
              About <LuBookOpen />
            </h4>
          </div>

          <div className="home-signout" onClick={handleSignOut}>
            <h4>
              Sign Out <GoSignOut />
            </h4>
          </div>
        </aside>
      </div>
    );
  }

  return null;
}
