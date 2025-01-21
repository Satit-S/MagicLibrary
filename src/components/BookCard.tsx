import React from 'react';
import { Link } from 'react-router-dom';
import AddToListButton from './AddToListButton';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    averageRating?: number;
    imageLinks?: {
      thumbnail?: string;
    };
  };
  handleRateFeedback: (bookId: string, feedback: 'like' | 'dislike') => void;
  handleAddToList: (book: { title: string; author: string }) => void;
}


const BookCard: React.FC<Book> = ({ id, volumeInfo, handleRateFeedback}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex flex-col md:flex-row">
      {volumeInfo.imageLinks?.thumbnail && (
        <img
          src={volumeInfo.imageLinks.thumbnail}
          alt={volumeInfo.title}
          className="w-full md:w-1/3 h-auto object-cover rounded"
        />
      )}
      <div className="w-full md:w-2/3 pl-4">
        <h2 className="text-xl font-bold">{volumeInfo.title}</h2>
        <p><strong>Author(s):</strong> {volumeInfo.authors?.join(', ') || 'Unknown'}</p>
        <p className="text-gray-600">{volumeInfo.description?.substring(0, 100) || 'No description available'}...</p>
        <p><strong>Rating:</strong> {volumeInfo.averageRating} / 5</p>
        <div className="flex items-center space-x-2 mt-2">
          <label>Feedback: </label>
          <button
            className="text-3xl bg-green-600 text-white p-2 rounded-l-full focus:outline-none hover:bg-green-700"
            onClick={() => handleRateFeedback(id, 'like')}
          >
            👍🏻
          </button>
          <button
            className="text-3xl bg-red-500 text-white p-2 rounded-r-full focus:outline-none hover:bg-red-600"
            onClick={() => handleRateFeedback(id, 'dislike')}
          >
            👎🏻
          </button>
        </div>
        <Link
          className="mt-4 text-blue-500 hover:underline"
          to={`/book/${id}`}
        >
          Read More
        </Link>
        <br></br>
        <AddToListButton book={{ title: volumeInfo.title, author: volumeInfo.authors?.join(', ') || 'Unknown' }} /> 
      </div>
    </div>
  );
};

export default BookCard;
