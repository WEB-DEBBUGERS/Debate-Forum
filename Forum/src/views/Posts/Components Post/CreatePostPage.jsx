import { useContext, useState } from "react";
import { AppContext } from "../../../state/app.context";
import { push, ref, set } from "firebase/database";
import { db } from "../../../config/firebase-config";
import { getAllPosts } from "../../../services/posts.service";
import moment from "moment";
import Form from "./Form";
import Navbar from "../../../NavBar/Navbar";

export default function CreatePostPage() {
    const { userData } = useContext(AppContext);
    const [newPost, setNewPost] = useState({ title: '', content: '' });
       const [userPosts, setUserPosts] = useState([]);


        const createPost = async (title, content, authorHandle, authorUid) => {
    
            const userData = await getAllPosts(authorUid);
            const user = Object.values(userData)[0]; 
    
            if (user?.isBlocked) {
                return alert("You are blocked and cannot create posts.");   
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
    
                const posts = await getAllPosts();
                setUserPosts(posts);
            } catch (error) {
                console.error("Error creating post:", error);
            }
        };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPost((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPost.title && newPost.content) {
            await createPost(newPost.title, newPost.content, userData.handle, userData.uid);
            setNewPost({ title: '', content: '' });
        }
    };

    return (
        <div>
            {userData && (
                <>
                <Navbar/>
                <Form
                    title={newPost.title}
                    content={newPost.content}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                />
                </>
            )}
        </div>
    );
}