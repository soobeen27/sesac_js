import { useState, useEffect, useMemo } from 'react';
import { fetchPosts } from '../api/postsApi';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

const ITEM_PER_PAGE = 20;

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [showedPosts, setShowedPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data);
      setShowedPosts(data.slice(0, ITEM_PER_PAGE));
    });
  }, []);

  function next(pageNum) {
    const start = ITEM_PER_PAGE * (pageNum - 1);
    const end = ITEM_PER_PAGE * pageNum;
    setShowedPosts(posts.slice(start, end));
  }

  function prev(pageNum) {
    const start = ITEM_PER_PAGE * (pageNum - 1);
    const end = ITEM_PER_PAGE * pageNum;
    setShowedPosts(posts.slice(start, end));
  }

  // const totalPages = useMemo(() => {
  //   return Math.max(1, Math.ceil(posts.length / ITEM_PER_PAGE));
  // }, [posts.length]);

  // const visible = useMemo(()=> {
  //   const start = (page-1) * ITEM_PER_PAGE;
  //   return posts.slice(start, start + ITEM_PER_PAGE);
  // }, [posts, page])

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {showedPosts.map((p) => (
          <li key={p.id}>
            <Link to={`/posts/${p.id}`}>{p.title}</Link>
          </li>
        ))}
      </ul>
      <Pagination itemPerPage={ITEM_PER_PAGE} totalItemCount={posts.length} onNext={next} onPrev={prev} />
    </div>
  );
}
