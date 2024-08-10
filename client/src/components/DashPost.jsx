import { Button, Modal, Table } from "flowbite-react";
import { Model } from "mongoose";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPost, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModel, setShowModel] = useState(false);
  const [postIdToDelete, setPostIdDelete] = useState("");

  useEffect(() => {
    const fetchpost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchpost();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPost.length;
    try {
      const res = await fetch(
        `/api/post/getposts/userId=${currentUser._id}&startIndex=${startIndex}`
      );

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePost = async () => {
    setShowModel(false);
    try {
      const res = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );

      const data =await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev)=>prev.filter((post)=>post._id!==postIdToDelete))
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className= 'table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPost.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>

            {userPost.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                  <Table.Cell>
                    {new Date(post.updatedAt).toDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10  object-cover bg-gray-500 rounded-full"
                      ></img>
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModel(true);
                        setPostIdDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {" "}
                    <Link
                      to={`/updatepost/${post._id}`}
                      className="text-teal-500 hover:underline cursor-pointer"
                    >
                      <span>Edit</span>
                    </Link>
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
        <p>You Have no posts</p>
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
              Are you sure you want to delete post{" "}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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
