// src/routes/AppRouter.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home.tsx';
import SingleItem from '../pages/SingleItem.tsx';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<SingleItem />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
