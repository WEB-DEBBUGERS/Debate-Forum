import { db } from '../../config/firebase-config';
import { ref, query, orderByChild, equalTo, push, set, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import moment from 'moment';

export default function Comments({ postId, userData }) {
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    
    const addComment = async (postId, content, authorHandle, authorUid, parentCommentId = null) => {
        const newCommentObj = {
            postId,
            content,
            authorHandle,
            authorUid,
            createdOn: moment().format("MMMM Do YYYY, h:mm a"),
            parentCommentId,
        };

        try {
            if (!parentCommentId) {
                const commentRef = push(ref(db, 'comments'));
                const commentId = commentRef.key;
                newCommentObj.commentId = commentId;
                await set(commentRef, newCommentObj);
            } else {
                const replyRef = push(ref(db, 'replies'));
                const replyId = replyRef.key;
                newCommentObj.commentId = replyId;
                await set(replyRef, newCommentObj);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };


    useEffect(() => {
        const commentsQuery = query(ref(db, 'comments'), orderByChild('postId'), equalTo(postId));
        const repliesQuery = query(ref(db, 'replies'), orderByChild('postId'), equalTo(postId));

        const unsubscribeComments = onValue(commentsQuery, (snapshot) => {
            const fetchedComments = snapshot.exists() ? Object.values(snapshot.val()) : [];
            setComments(fetchedComments);
        });

        const unsubscribeReplies = onValue(repliesQuery, (snapshot) => {
            const fetchedReplies = snapshot.exists() ? Object.values(snapshot.val()) : [];
            setReplies(fetchedReplies);
        });

        return () => {
            unsubscribeComments();
            unsubscribeReplies();
        };
    }, [postId]);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() !== '') {
            addComment(postId, newComment, userData.handle, userData.uid);
            setNewComment('');
        }
    };

    const handleReplySubmit = (e, parentCommentId) => {
        e.preventDefault();
        if (replyContent.trim() !== '') {
            addComment(postId, replyContent, userData.handle, userData.uid, parentCommentId);
            setReplyContent('');
            setReplyTo(null);
        }
    };

    return (
        <div>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                style={{color: 'white'}}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button type="submit" style={{color: 'black' , fontSize: '15px'}}>💬</button>
            </form>

            <div>
                {comments.map(comment => (
                    <div key={comment.commentId} style={{ marginBottom: '20px' ,color: 'black'}}>
                        <p>{comment.content}</p>
                        <small>By {comment.authorHandle} on {comment.createdOn}</small>

                        <button onClick={() => setReplyTo(replyTo === comment.commentId ? null : comment.commentId)}>
                            {replyTo === comment.commentId ? 'Cancel' : '↩️'}
                        </button>

                        {replyTo === comment.commentId && (
                            <form onSubmit={(e) => handleReplySubmit(e, comment.commentId)}>
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder="Write a reply..."
                                />
                                <button type="submit">Add Reply</button>
                            </form>
                        )}

                     
                        {replies
                            .filter(reply => reply.parentCommentId === comment.commentId)
                            .map(reply => (
                                <div key={reply.commentId} style={{ marginLeft: '20px', borderLeft: '2px solid #ccc', paddingLeft: '10px', marginTop: '10px' }}>
                                    <p>{reply.content}</p>
                                    <small>Reply by {reply.authorHandle} on {reply.createdOn}</small>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
