import React from "react";
import "./sidebar.css";
import SidebarButton from "./sidebarButton";
import { FaSignOutAlt } from "react-icons/fa";
import { IoMdHome,IoIosCreate } from "react-icons/io";
import { MdExplore } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

export default function Index() {

  return (
    <div className="sidebar-container">
        <div className="sidebar-logo">
        <img
          src="./image/logo.png"
          alt="NFT Logo"
          className="sidebar-img"
        />
      </div>
      <div className="sidebar-menu">
        <SidebarButton title="Home" to="/home" icon={<IoMdHome size={24} />} />
        <SidebarButton title="Explore" to="/explore" icon={<MdExplore size={24} />} />
        <SidebarButton title="Create" to="/create" icon={<IoIosCreate size={24} />} />
        <SidebarButton title="Profile" to="/profile" icon={<CgProfile size={24} />} />
      </div>
      <SidebarButton title="Sign Out" to="" icon={<FaSignOutAlt size={24} />} />
    </div>
  );
}
