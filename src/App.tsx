import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookSearch from './components/BookSearch';
import BookDetail from './components/BookDetail';
import ErrorBoundary from './components/ErrorBoundary';
import bg from '../image/bg.jpg';
import ML from '../image/ML.png';
import SavedList from './components/SavedList';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="bg-fixed bg-cover" style={{ backgroundImage: `url(${bg})` }}>
        <div className="container mx-auto p-4">
        <div className="flex justify-left items-left auto"> <img src={ML} alt="Logo" className="w-1/3 h-auto rounded shadow-lg" />
         </div>
         <br></br>
            <Routes>
              <Route path="/" element={<BookSearch />} />
              <Route path="/book/:id" element={<BookDetail />} />
              <Route path="/saved-list" element={<SavedList />} />
            </Routes>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;
