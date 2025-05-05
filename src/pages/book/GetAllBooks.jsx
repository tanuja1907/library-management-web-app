import { Card } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const GetAllBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toastShownRef = useRef(false);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/books");
      const fetchedBooks = Array.isArray(res.data) ? res.data : [];
      setBooks(fetchedBooks);
      if (fetchedBooks.length === 0 && !toastShownRef.current) {
        toast.dismiss(); 
        toast.warning("No books found in this library!");
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      toast.dismiss(); 
      toast.error("Failed to fetch books!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://localhost:8080/books/${bookId}`);
      toast.dismiss(); 
      toast.success("Book deleted successfully!");
      fetchBooks(); // <-- Re-fetch after deletion
    } catch (err) {
      console.error("Error deleting book:", err);
      toast.dismiss(); 
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to delete book!");
      }
    }
  };

  const handleEdit = (bookId) => {
    navigate(`/update-book/${bookId}`);
  };

  const handleAddNewBook = () => {
    navigate("/books");
  };

  useEffect(() => {
    fetchBooks();
    if (location.state?.bookAdded && !toastShownRef.current) {
      toast.dismiss(); 
      toast.success("Book added successfully!");
      toastShownRef.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="overflow-x-auto p-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg  mb-4 text-white">No books yet. Add your first book!</p>
          <Button onClick={handleAddNewBook} variant="outline" className="bg-blue-500 text-white">
            + Add Book
          </Button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-center text-2xl font-bold text-white">Books</h1>
            <Button onClick={handleAddNewBook} variant="outline" className="border-white text-white hover:bg-blue-600">
              + Add New Book
            </Button>
          </div>
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-5 border-b border-gray-300 text-center">ID</th>
                <th className="p-5 border-b border-gray-300 text-center">Title</th>
                <th className="p-5 border-b border-gray-300 text-center">Author</th>
                <th className="p-5 border-b border-gray-300 text-center">Available Copies</th>
                <th className="p-5 border-b border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="bg-white hover:bg-gray-50 transition border-t border-gray-300"
                >
                  <td className="p-5 border-r border-gray-200 text-center">{book.id}</td>
                  <td className="p-5 border-r border-gray-200 text-center">{book.title}</td>
                  <td className="p-5 border-r border-gray-200 text-center">{book.author}</td>
                  <td className="p-5 border-r border-gray-200 text-center">{book.availableCopies}</td>
                  <td className="p-5 flex gap-2 justify-center">
                    <Button
                      onClick={() => handleEdit(book.id)}
                      variant="outline"
                      className="hover:bg-blue-500"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(book.id)}
                      variant="outline"
                      className="hover:bg-red-500"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default GetAllBooks;
