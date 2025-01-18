import React from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from './ToastNotification';

interface AddToListButtonProps {
  book: {
    title: string;
    author: string;
  };
}

const AddToListButton: React.FC<AddToListButtonProps> = ({ book }) => {
  const navigate = useNavigate();

  const handleAddToList = () => {
    const savedBooks = JSON.parse(localStorage.getItem('savedBooks') || '[]') as { title: string; author: string }[];

    // ตรวจสอบว่าหนังสือมีอยู่ในลิสต์แล้วหรือไม่
    const isBookAlreadySaved = savedBooks.some(
      (savedBook) => savedBook.title === book.title && savedBook.author === book.author
    );

    if (!isBookAlreadySaved) {
      savedBooks.push(book);
      localStorage.setItem('savedBooks', JSON.stringify(savedBooks));
      navigate('/saved-list'); // Navigate to saved list page
    } else {
      showToast('This book is already in your saved list!', 'info');
    }
  };

  return (
    <button
      onClick={handleAddToList}
      className="text-orange-600 hover:underline">
      + add list
    </button>
  );
};

export default AddToListButton;
