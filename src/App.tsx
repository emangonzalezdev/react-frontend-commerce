// src/App.tsx

import React from 'react';
import AppRouter from './routes/AppRouter.tsx';


const App: React.FC = () => {
  return (
    <div className="app">
     <AppRouter />
    </div>
  );
};

export default App;
