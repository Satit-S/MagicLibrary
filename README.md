
# Magic Library

Magic Library is a book recommendation system built with React, TypeScript, Vite, and TensorFlow.js. The project utilizes the Google Books API for book searches and incorporates a machine learning model to improve book recommendations based on user feedback.

## Features

### 1. Book Search
- Search for books by title or genre using the Google Books API.
- Filter results by genre to narrow down the selection.

### 2. User Feedback
- Users can provide feedback on books by liking or disliking them.
- Feedback is used to train a machine learning model to provide personalized recommendations.

### 3. Machine Learning Model
- Built with TensorFlow.js, the model uses user feedback to improve the accuracy of recommendations.
- The model is trained using user ratings and predicts future preferences.

### 4. Book Recommendations
- Based on user feedback, the system suggests books that align with user preferences.
- The "Suggestions for You" section displays books liked by the user.

### 5. Saved Book List
- Users can save books to a personalized list.
- The saved list is stored locally and persists across sessions.
- Users can view and manage their saved books, including removing books from the list.


## Usage

1. **Search for Books**: Enter a search query and select a genre. Click the "Search" button to display book results.
2. **Provide Feedback**: Use the thumbs-up (👍🏻) and thumbs-down (👎🏻) buttons to like or dislike books.
3. **View Suggestions**: Based on your feedback, the system will recommend books in the "Suggestions for You" section.
4. **Save Books**: Click the "+ add list" button on a book card to save it to your list.
5. **View Saved Books**: Navigate to the "BookLists" page to see all saved books. You can remove books from this list as needed.

## Machine Learning Details

- **Model**: TensorFlow.js is used to create a sequential model with dense layers.
- **Training**: The model is trained using binary cross-entropy loss and the Adam optimizer.
- **Predictions**: The model predicts book preferences based on user feedback.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- TensorFlow.js
- Google Books API
- React Router
- Local Storage for state persistence
- GitHub Pages for deployment


## Acknowledgments

- [Google Books API](https://developers.google.com/books/docs/overview)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
