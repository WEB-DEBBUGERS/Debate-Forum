import { push, ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import { useState, useEffect, useContext } from "react";
import { db } from '../../config/firebase-config';
import { AppContext } from "../../state/app.context";
import Comments from "../../views/Comments/Comments";
import PostList from "./Components Post/PostList";
import CreatePostForm from "./Components Post/CreatePost";
import { getUserData } from "../../services/users.service";
import moment from 'moment';

export default function Posts() {
    const { userData } = useContext(AppContext);
    const [userPosts, setUserPosts] = useState([]);


    const [newPost, setNewPost] = useState({
        title: '',
        content: '',
    });

    const getUserPosts = async (uid) => {
        try {
            const snapshot = await get(query(ref(db, 'posts'), orderByChild('authorUid'), equalTo(uid)));

            if (!snapshot.exists()) {
                console.log("No posts found");
                return {};
            }

            console.log("Posts found:", snapshot.val());
            return snapshot.val();
        } catch (error) {
            console.error("Error fetching posts:", error);
            return {};
        }
    };

    const createPost = async (title, content, authorHandle, authorUid) => {

        const userData = await getUserData(authorUid);
        const user = Object.values(userData)[0]; 

        if (user?.isBlocked) {
            throw new Error("You are blocked from posting.");
        }


        try {
            const newPostRef = push(ref(db, 'posts'));
            const post = {
                title,
                content,
                authorHandle,
                authorUid,
                createdOn: moment().format("MMMM Do YYYY, h:mm a"),
            };

            await set(newPostRef, post);

            const posts = await getUserPosts(authorUid);
            setUserPosts(posts);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPost.title && newPost.content) {
            createPost(newPost.title, newPost.content, userData.handle, userData.uid);
            setNewPost({ title: '', content: '' });
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
            if (!userData || !userData.uid) return;

            const posts = await getUserPosts(userData.uid);
            setUserPosts(posts);
        };

        fetchPosts();
    }, [userData]);

    return (
        <div>

            {userData && (
                <CreatePostForm
                    title={newPost.title}
                    content={newPost.content}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
            )}

            {userPosts && Object.entries(userPosts).length > 0 ? (
                Object.entries(userPosts).map(([postId, post]) => (
                    <div key={postId}>
                        <PostList
                            id={postId}
                            title={post.title}
                            content={post.content}
                            authorHandle={post.authorHandle}
                            createdOn={post.createdOn}
                        />
                    </div>
                ))
            ) : (
                <p>No posts yet.</p>
            )}
        </div>
    );

}
