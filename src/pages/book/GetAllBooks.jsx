import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useRef } from 'react';

const GetAllBooks = () => {

    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const toastShownRef=useRef(false);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/books");
            const fetchedBooks = Array.isArray(res.data) ? res.data : [];
            if (fetchedBooks.length === 0) {
                toast.warning("No books found in this library!");
            }
            setBooks(fetchedBooks);
            console.log("Fetched books:", fetchedBooks);
        } catch (err) {
            console.error("Error fetching books:", err);
            toast.error("Failed to fetch books!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bookId) => {
        try {
            await axios.delete(`http://localhost:8080/books/${bookId}`);
            if (res.data === true) {
                toast.success("Book deleted successfully!");
                fetchBooks();
            } else {
                toast.error("Cannot delete a borrowed book!");
            }
        } catch (err) {
            console.error("Error deleting book:", err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Failed to delete book!");
            }
        }
    }
    const handleEdit = (bookId) => {
        navigate(`/update-book/${bookId}`);
    }

    const handleAddNewBook = () => {
        navigate("/books");

    }

    useEffect(() => {
        fetchBooks();
        if (location.state?.bookAdded && !toastShownRef.current) {
            toast.success("Book added successfully!");
           toastShownRef.current = true; // Set the ref to true after showing the toast
            window.history.replaceState({}, document.title); // Clears the state after the toast
        }
    }, [location.state ]);


    return (
        <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Books</h1>
                <Button onClick={handleAddNewBook} variant="outline" className='mt-4'> + Add New Book</Button>
            </div>
            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
                </div>) :
                books.length === 0 ? (
                    <div>
                        No Books Available.<br />
                        <Button onClick={handleAddNewBook} variant="outline" className='mt-4'>Add your first Book</Button>
                    </div>

                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {books.map((book) => (
                            <Card key={book.id} >
                                <CardContent className="p-4 space-y-2">
                                    <h2 className='text-xl font-bold'>Id:{book.id}</h2>
                                    <p className='text-sm text-muted-foreground'>Title : {book.title}</p>
                                    <p className='text-sm text-muted-foreground'>Author : {book.author}</p>
                                    <p className='text-sm text-muted-foreground'>Available Copies : {book.availableCopies}</p>
                                    <div className='flex gap-2 mt-2'>
                                        <Button onClick={() => handleEdit(book.id)} variant="outline" className='hover:bg-blue-400'>Edit</Button>
                                        <Button onClick={() => handleDelete(book.id)} variant="outline" className='hover:border-red-500 hover:bg-red-500'>Delete</Button>

                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
        </div>
    )
}

export default GetAllBooks
