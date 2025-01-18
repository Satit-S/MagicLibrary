import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';


interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    averageRating?: number;
    imageLinks?: {
      thumbnail?: string;
      large?: string;
    };
  };
}

const BookDetail: React.FC = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate();
  const location = useLocation();
  
  
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBook = async (retryCount = 3) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=AIzaSyC2DVtBeNSKh1EwwCqhJmahNNB7yRMcMzk`);
      setBook(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429 && retryCount > 0) {
        setTimeout(() => fetchBook(retryCount - 1), 1000);
      } else {
        console.error('Error fetching book details:', error);
        setError('Error fetching book details');
      }
    }
  };

  const handleBackToHome = () => {
    // ไม่ต้องบวก genre เข้าไปใน query ซ้ำซ้อน
    const searchQuery = location.state?.searchQuery || '';
    const books = location.state?.books || [];
    const genre = location.state?.genre || 'Fiction';
  
    navigate('/', {
      state: { searchQuery, books, genre },
    });
  };
  

  useEffect(() => {
    fetchBook();
  }, [id]);

  const stripHtmlTags = (str: string | undefined) => {
    return str?.replace(/<\/?[^>]+(>|$)/g, "") || 'No description available';
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow flex">
      {book.volumeInfo.imageLinks?.large && (
        <img
          src={book.volumeInfo.imageLinks.large}
          alt={book.volumeInfo.title}
          className="w-1/3 h-auto object-cover mr-4 rounded"
        />
      )}
      <div className="w-2/3">
        <h2 className="text-4xl font-bold">{book.volumeInfo.title}</h2>
        <p className="text-xl"><strong>Author(s):</strong> {book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
        <p className="text-gray-600 text-2xl">{stripHtmlTags(book.volumeInfo.description)}</p>
        <p><strong>Rating:</strong> {book.volumeInfo.averageRating ? `${book.volumeInfo.averageRating} / 5` : 'No rating available'}</p>

        <button
          onClick={handleBackToHome}
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default BookDetail;
