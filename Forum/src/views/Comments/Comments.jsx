import { db } from '../../config/firebase-config';
import { ref, get, query, orderByChild, equalTo, push, set, onValue } from "firebase/database";
import React, { useState, useEffect } from "react";

export default function Comments({ postId, userData }) {
    const [comments, setComments] = useState([]);
    const [replies, setReplies] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');

    // 🟢 Функция за добавяне на коментар или реплай
    const addComment = async (postId, content, authorHandle, authorUid, parentCommentId = null) => {
        const newCommentObj = {
            postId,
            content,
            authorHandle,
            authorUid,
            createdOn: new Date().toString(),
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

    // 🟢 Зареждане на коментари и реплайове
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
            <h3>Comments</h3>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                />
                <button type="submit">Add Comment</button>
            </form>

            <div>
                {comments.map(comment => (
                    <div key={comment.commentId} style={{ marginBottom: '20px' }}>
                        <p>{comment.content}</p>
                        <small>By {comment.authorHandle} on {comment.createdOn}</small>

                        <button onClick={() => setReplyTo(replyTo === comment.commentId ? null : comment.commentId)}>
                            {replyTo === comment.commentId ? 'Cancel Reply' : 'Reply'}
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

                        {/* 🟢 Визуализирай реплайовете само от масива replies */}
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
