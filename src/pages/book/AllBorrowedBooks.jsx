import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllBorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toastShown, setToastShown] = useState(false);
  const navigate = useNavigate();

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/books/borrowedBooks');
      const data = Array.isArray(response.data) ? response.data : [];
      setBorrowedBooks(data);

      if (data.length === 0 && !toastShown) {
        toast.dismiss();  
        toast.warning('No books are currently borrowed.');
        setToastShown(true);
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to fetch borrowed books.');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (bookId, patronId, bookTitle, patronName) => {
    toast.dismiss();
    try {
      
      setBorrowedBooks((prev) =>
        prev
          .map((book) => {
            if (book.bookId !== bookId) return book;
            const updatedPatrons = book.patron.filter((p) => p.patronId !== patronId);
            return { ...book, patron: updatedPatrons };
          })
          .filter((book) => book.patron.length > 0) // remove books with no patrons
      );
  
      await axios.post('http://localhost:8080/books/return', {
        bookId,
        patronId,
      });
  
      toast.success(`Returned '${bookTitle}' for '${patronName}' successfully!`);
      fetchBorrowedBooks(); // Refresh to ensure state is synced
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return the book.');
      
      fetchBorrowedBooks();
    }
  };
  
  
  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  return (
    <div className="bg-gray-100 max-w-7xl mx-auto p-4 rounded-lg shadow-lg mt-10">
      <motion.div
        className="p-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          All Borrowed Books 📚
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          </div>
        ) : borrowedBooks.length === 0 ? (
          <div className="text-center text-gray-600 mt-10">
            <p>No borrowed books found.</p>
            <Button
              onClick={() => navigate('/borrow')}
              className="mt-4"
              variant="outline"
            >
              Borrow a Book
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-300 text-black font-semibold">
                  <TableHead>Book ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Copies Available</TableHead>
                  <TableHead>Patron ID</TableHead>
                  <TableHead>Patron Name</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedBooks.flatMap((book) =>
                  book.patron.map((p) => (
                    <motion.tr
                      key={`${book.bookId}-${p.patronId}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      whileHover={{ scale: 1.01, backgroundColor: '#f0f8ff' }}
                      className="hover:bg-blue-50 text-black transition-all duration-200"
                    >
                      <TableCell className="font-medium">{book.bookId}</TableCell>
                      <TableCell className="hover:text-blue-700 cursor-pointer transition-colors duration-200">
                        {book.title}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            book.copiesAvailable === 0
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {book.copiesAvailable}
                        </span>
                      </TableCell>
                      <TableCell>{p.patronId}</TableCell>
                      <TableCell className="font-semibold">{p.name}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleReturn(book.bookId, p.patronId, book.title, p.name)
                          }
                          className="hover:bg-red-600 hover:text-white transition"
                          variant="outline"
                          size="sm"
                        >
                          Return
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AllBorrowedBooks;
