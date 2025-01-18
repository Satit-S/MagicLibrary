import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Book {
  title: string;
  author: string;
}

const SavedList: React.FC = () => {
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedBooks') || '[]') as Book[];
    setSavedBooks(saved);
  }, []);

  const handleRemoveBook = (index: number) => {
    const updatedBooks = savedBooks.filter((_, i) => i !== index);
    setSavedBooks(updatedBooks);
    localStorage.setItem('savedBooks', JSON.stringify(updatedBooks));
  };

  const navigate = useNavigate();
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
    <div className="bg-white p-6 rounded-lg shadow relative">
      <h1 className="text-2xl font-bold mb-4 antialiased">Book Lists</h1>
      <ul>
        {savedBooks.map((book, index) => (
          <li
            key={index}
            className="flex items-center justify-between border-b border-gray-200 py-2"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-4 antialiased">
                <span className="font-medium uppercase">{book.title}</span> by{' '}
                <span className="text-gray-600">{book.author}</span>
              </span>
            </div>
            <button
              onClick={() => handleRemoveBook(index)}
              className="text-red-500 hover:text-red-700 ml-4"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-4">
        <button
          onClick={handleBackToHome}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 absolute top-30 right-15"
        >
          Back to Home
        </button>
      </div>
  </div>
);
};

export default SavedList;
