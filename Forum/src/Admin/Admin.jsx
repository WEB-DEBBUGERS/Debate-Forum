import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../state/app.context";
import { getAllPosts, deletePost, getAllUsers, blockUser, unblockUser } from "../services/admin.service";
import Navbar from "../NavBar/Navbar";
import { ref, remove, get, child } from "firebase/database";
import "./AdminPanel.css";
import { db } from "../config/firebase-config";


export const Admin = () => {
    const { user, userData } = useContext(AppContext);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchQueryUsers, setSearchQueryUsers] = useState("");
    const [searchQueryPosts, setSearchQueryPosts] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const navigate = useNavigate();

    useEffect(() => {
        if (!userData || !userData.isAdmin) {
            navigate("/");
        }
    }, [userData, navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers();
                setUsers(Object.entries(allUsers));
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const allPosts = await getAllPosts();
                setPosts(Object.entries(allPosts));
            } catch (error) {
                console.error("Error fetching posts: ", error);
            }
        };
        fetchPosts();
    }, []);

    const deletePostAndRelatedData = async (postId) => {
        try {

            await deletePost(postId);


            const commentsSnap = await get(child(ref(db), 'comments'));
            if (commentsSnap.exists()) {
                const comments = commentsSnap.val();
                for (const [commentId, comment] of Object.entries(comments)) {
                    if (comment.postId === postId) {
                        await remove(ref(db, `comments/${commentId}`));
                    }
                }
            }


            const repliesSnap = await get(child(ref(db), 'replies'));
            if (repliesSnap.exists()) {
                const replies = repliesSnap.val();
                for (const [replyId, reply] of Object.entries(replies)) {
                    if (reply.postId === postId) {
                        await remove(ref(db, `replies/${replyId}`));
                    }
                }
            }


            setPosts((prevPosts) => prevPosts.filter(([id]) => id !== postId));
            alert("Post and related data deleted successfully.");
        } catch (error) {
            console.error("Error deleting post and related data: ", error);
        }
    };

    const handleBlock = async (uid) => {
        try {
            await blockUser(uid);
            setUsers((prev) => prev.map(([id, user]) => id === uid ? [id, { ...user, isBlocked: true }] : [id, user]));
        } catch (error) {
            console.error("Error blocking user: ", error);
        }
    };

    const handleUnblock = async (uid) => {
        try {
            await unblockUser(uid);
            setUsers((prev) => prev.map(([id, user]) => id === uid ? [id, { ...user, isBlocked: false }] : [id, user]));
        } catch (error) {
            console.error("Error unblocking user: ", error);
        }
    };

    const filteredUsers = users.filter(([id, user]) =>
        user.displayName?.toLowerCase().includes(searchQueryUsers.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQueryUsers.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchQueryUsers.toLowerCase())
    );

    const filteredPosts = posts.filter(([id, post]) =>
        post.authorHandle?.toLowerCase().includes(searchQueryPosts.toLowerCase())
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        const key = sortBy;
        return a[1][key]?.localeCompare(b[1][key]);
    });

    if (!userData || !userData.isAdmin) return null;

    return (
        <div>
            <Navbar />
            <div className="admin-wrapper">
                <h2 className="admin-title">Administration Hub</h2>
                <p>Welcome {userData.adminDetails?.firstName} {userData.adminDetails?.lastName}</p>

                <h3>All Users</h3>
                <input
                    type="text"
                    placeholder="Search users by name/email/username"
                    value={searchQueryUsers}
                    onChange={(e) => setSearchQueryUsers(e.target.value)}
                />
                <ul>
                    {filteredUsers.map(([uid, user]) => (
                        <li key={uid}>
                            {user.displayName} ({user.email})
                            {user.isBlocked ? (
                                <button onClick={() => handleUnblock(uid)}>Unblock</button>
                            ) : (
                                <button onClick={() => handleBlock(uid)}>Block</button>
                            )}
                        </li>
                    ))}
                </ul>

                <h3>All Posts</h3>
                <input
                    type="text"
                    placeholder="Search posts by author handle"
                    value={searchQueryPosts}
                    onChange={(e) => setSearchQueryPosts(e.target.value)}
                />
                <select onChange={(e) => setSortBy(e.target.value)} value={sortBy}>
                    <option value="title">Title</option>
                    <option value="authorHandle">Author</option>
                </select>
                <ul>
                    {sortedPosts.map(([id, post]) => (
                        <li key={id}>
                            <strong>{post.title}</strong> by {post.authorHandle}
                            <button onClick={() => deletePostAndRelatedData(id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};