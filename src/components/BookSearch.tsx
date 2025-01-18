import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import ToastNotification, { showToast } from './ToastNotification';
import BookCard from './BookCard';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const genres = ['Fiction', 'Non-fiction', 'Mystery', 'Fantasy', 'Science', 'Biography', 'History'];

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
  userFeedback?: 'like' | 'dislike';
}

const BookSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState(location.state?.searchQuery || sessionStorage.getItem('searchQuery') || '');
  const [genre, setGenre] = useState(location.state?.genre || sessionStorage.getItem('genre') || 'Fiction');
  const [books, setBooks] = useState<Book[]>(location.state?.books || JSON.parse(sessionStorage.getItem('books') || '[]'));

  useEffect(() => {
    if (query && books.length === 0) {
      executeSearch(query, genre);
    }
  }, [query, genre, books.length]);

  const executeSearch = async (searchQuery = query, searchGenre = genre) => {
    try {
      const queryWithGenre = `${searchQuery} ${searchGenre}`;
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${queryWithGenre}&maxResults=27&startIndex=0&key=AIzaSyC2DVtBeNSKh1EwwCqhJmahNNB7yRMcMzk`
      );
      const items: Book[] = response.data.items || [];
      setBooks(items);

      const searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      searchHistory.push({ query: queryWithGenre, genre, date: new Date().toISOString() });
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

      sessionStorage.setItem('searchQuery', searchQuery);
      sessionStorage.setItem('books', JSON.stringify(items));
      sessionStorage.setItem('genre', searchGenre);

      navigate('/', { state: { searchQuery: searchQuery, books: items, genre: searchGenre } });
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearchClick = () => {
    executeSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => { 
    if (event.key === 'Enter') { 
      executeSearch(); 
    } 
  };
  
  const [feedback, setFeedback] = useState<{ [bookId: string]: 'like' | 'dislike' }>({});

  const handleRateFeedback = (bookId: string, rating: 'like' | 'dislike') => {
  setFeedback((prevFeedback) => ({ ...prevFeedback, [bookId]: rating }));
    console.log('Updated Feedback:', { ...feedback, [bookId]: rating });
    showToast('Thank you for your feedback!', 'success') ;
    trainRecommendationModel();
  };

const getUserRatings = () => {
  const ratings = Object.keys(feedback).map(bookId => ({
    bookId: bookId,
    rating: feedback[bookId] === 'like' ? 1 : 0,
  }));
  
  console.log('User Ratings after mapping:', ratings);
  return ratings;
};

  const trainRecommendationModel = () => {
    
    const userRatings = getUserRatings();

    if (userRatings.length === 0) {
      console.warn('No ratings to train on.');
      return;
    }

    const xs = tf.tensor2d(userRatings.map((rating, index) => [index, rating.rating]), [userRatings.length, 2]);
    const ys = tf.tensor1d(userRatings.map((rating) => rating.rating));

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 10, inputShape: [2], activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({ loss: 'binaryCrossentropy', optimizer: 'adam' });

    model.fit(xs, ys, { epochs: 5 }).then(() => {
      console.log('Model trained with feedback');
      showToast('Recommendations updated based on your feedback!', 'info');
      const predictions = model.predict(xs) as tf.Tensor;
      const predictionData = predictions.dataSync();
      console.log('Predictions:', predictionData);
    });
  };

  const getSuggestionsForYou = () => {
    const feedbackData = JSON.parse(localStorage.getItem('bookFeedback') || '{}');
    return books.filter(book => feedbackData[book.id] === 'like').slice(0, 3);
  };

  const handleAddToList = (book: { title: string; author: string }) => {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]') as { title: string; author: string }[];
    savedBooks.push(book);
    localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
    navigate('/saved-list'); // Navigate to saved list page
  };

  return (
    <div className="min-h-screen bg-gray-100/50 rounded">
      <div className="bg-slate-50/50 bg-clip-border shadow rounded">
        <div className="container mx-auto p-6 rounded">
          <h1 className="text-3xl font-bold">Book Recommendation System</h1>
          <div className="mt-4 flex space-x-4">
            <input
              className="border border-gray-300/50 p-2 rounded w-full"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for books..."
            />
            <select className="border border-gray-300 p-2 rounded" value={genre} onChange={(e) => setGenre(e.target.value)}>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <button className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-800 " onClick={handleSearchClick}>Search</button>
            <Link to="/saved-list" className="bg-orange-400 text-white p-2 rounded hover:bg-orange-700 w-fit">
              BookLists
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-bold">Suggestions for You</h2>
        {getSuggestionsForYou().length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 h-m-65">
            {getSuggestionsForYou().map((book) => (
              <BookCard key={book.id} {...book} handleRateFeedback={handleRateFeedback} handleAddToList={handleAddToList} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No suggestions available yet. Please provide feedback on the BOOKS you like to train the AI.</p>
        )}

        <h2 className="text-2xl font-bold mt-6">More Recommendations</h2>
        {books.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 h-m-65">
            {books.filter(book => book.userFeedback !== 'dislike').map((book, index) => (
              <BookCard key={`${book.id}-${index}`} {...book} handleRateFeedback={handleRateFeedback} handleAddToList={handleAddToList}/>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No books found. Try searching for something else!</p>
        )}
      </div>

      <ToastNotification />
    </div>
  );
};

export default BookSearch;