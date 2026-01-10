import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout.jsx';

import Home from './pages/Home.jsx';
import Users from './pages/Users.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';
import UserDetail from './pages/UserDetail.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          {/* 동일 계층으로 본 sibling */}
          <Route path="users" element={<Users />} />
          <Route path="users/:userId" element={<UserDetail />} />

          {/* 계층구조로 본 parent/child */}
          {/* <Route path="users" element={<Users />}>
            <Route path=":userId" element={<UserDetail />} />
          </Route> */}
          <Route path="about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
