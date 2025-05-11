import { useState, useEffect } from "react";
import PostList from "./Components Post/PostList";
import { getAllPosts } from "../../services/posts.service";

export default function Posts() {
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await getAllPosts();
            setUserPosts(posts);
        };

        fetchPosts();
    }, []);

    return <div>{userPosts && <PostList style={{backgroundColor: '#FFF9E6'}} posts={userPosts} />}</div>;
}
