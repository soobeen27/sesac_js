import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchCommentsById, fetchPostById } from '../api/postsApi';

import Comment from '../components/Comment';

export default function PostDetail() {
  const { postId } = useParams();
  const [post, setPost] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchPostById(postId)
      .then((data) => {
        setPost(data);
      })
      .catch((err) => {
        console.log(err);
      });
    fetchCommentsById(postId)
      .then((data) => {
        setComments(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [postId]);

  return (
    <>
      <h1>Post #{post.id}</h1>
      <p style={{ fontWeight: 'bold' }}>{post.title}</p>
      <p>userId: {post.userId}</p>
      <hr />
      <p>{post.body}</p>
      <hr />
      <h2>Comments ({comments.length})</h2>
      <ul>
        {comments.map((c) => (
          <Comment key={c.id} name={c.name} email={c.email} body={c.body} />
        ))}
      </ul>
    </>
  );
}
