import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { SignOut } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSideBar() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const lacation = useLocation();
  const [tab, setTab] = useState();
  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout/${currentUser._id}`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(SignOut());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [lacation]);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ?'Admin':'User'}
              labelColor="dark"
              as={"div"}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser && currentUser.isAdmin && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          {currentUser.isAdmin && (
            <Link to="/dashboard?tab=post">
              <Sidebar.Item
                active={tab === "post"}
                icon={HiDocumentText}
                as={"div"}
              >
                Post
              </Sidebar.Item>
            </Link>
          )}
                              {currentUser.isAdmin && (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                active={tab === "comments"}
                icon={HiAnnotation}
                as={"div"}
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
                    {currentUser.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                active={tab === "users"}
                icon={HiOutlineUserGroup}
                as={"div"}
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
