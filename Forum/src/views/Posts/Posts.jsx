import { push, ref, set, get, query, orderByChild, equalTo } from "firebase/database";
import { useState, useEffect, useContext } from "react";
import { db } from "../../config/firebase-config";
import { AppContext } from "../../state/app.context";

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
        try {
            const newPostRef = push(ref(db, 'posts'));
            const post = {
                title,
                content,
                authorHandle,
                authorUid,
                createdOn: new Date().toString(),
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
            <h1>Posts</h1>
            
        
            {userData && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input 
                            type="text" 
                            name="title" 
                            value={newPost.title} 
                            onChange={handleChange} 
                            placeholder="Enter post title" 
                            required 
                        />
                    </div>
                    <div>
                        <label>Content:</label>
                        <textarea 
                            name="content" 
                            value={newPost.content} 
                            onChange={handleChange} 
                            placeholder="Enter post content" 
                            required 
                        />
                    </div>
                    <button type="submit">Create Post</button>
                </form>
            )}

            {userPosts && Object.entries(userPosts).length > 0 ? (
                Object.entries(userPosts).map(([postId, post]) => (
                    <div key={postId}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                        <small>By {post.authorHandle} on {post.createdOn}</small>
                    </div>
                ))
            ) : (
                <p>No posts yet.</p>
            )}
        </div>
    );
}
