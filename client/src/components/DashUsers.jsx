import { Button, Modal, Table } from "flowbite-react";
import { Model } from "mongoose";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
export default function DashUsers() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [userIdToDelete, setUserIdDelete] = useState("");

  useEffect(() => {
    const fetchusers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchusers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);

      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteUser = async () => {
    setShowModel(false);
    try {
      const res = await fetch(`/api/user/deleteuser/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100  scrollbar-thumb-slate-100 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500  ">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date created</Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell> Username</Table.HeadCell>
              <Table.HeadCell> Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
           
            </Table.Head>

            {users.map((user) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                  <Table.Cell>
                    {new Date(user.createdAt).toDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-20 h-10  object-cover bg-gray-500 rounded-full"
                    ></img>
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {" "}
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setUserIdDelete(user._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
              
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p>You Have no users</p>
      )}
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200  mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete user{" "}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                Yes,I'm sure
              </Button>
              <Button color="success" onClick={() => setShowModel(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
