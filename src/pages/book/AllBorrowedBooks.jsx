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

const AllBorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/books/borrowedBooks');
      setBorrowedBooks(response.data);
    } catch (error) {
      toast.error('Failed to fetch borrowed books.');
    }
  };

  const handleReturn = async (bookId, patronId, bookTitle, patronName) => {
    try {
      await axios.post('http://localhost:8080/books/return', {
        bookId,
        patronId,
      });
      toast.success(`Returned '${bookTitle}' for '${patronName}' successfully!`);
      fetchBorrowedBooks();
    } catch (error) {
      toast.error('Failed to return the book.');
    }
  };

  return (
    <div className="bg-gray-100 max-w-7xl mx-auto p-4 rounded-lg shadow-lg ">
      <motion.div
        className="p-6 "
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600 hover:scale-105 transition-transform duration-300">
          All Borrowed Books 📚
        </h2>

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
              {borrowedBooks.length > 0 ? (
                borrowedBooks.flatMap((book) =>
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
                      <TableCell className="hover:text-indigo-600">{p.patronId}</TableCell>
                      <TableCell className="hover:text-indigo-600 font-semibold transition-colors duration-200">
                        {p.name}
                      </TableCell>
                      <TableCell className="">
                        <Button
                          onClick={() => handleReturn(book.bookId, p.patronId, book.title, p.name)}
                          className="hover:shadow-md hover:bg-red-600 hover:text-white hover:scale-105 transition-transform duration-200"
                          variant="outline"
                          size="sm"
                        >
                          Return
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))
                )
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No borrowed books found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
};

export default AllBorrowedBooks;
