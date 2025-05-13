import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const BorrowBook = () => {
    const [patronId, setPatronId] = useState('');
    const [bookId, setBookId] = useState('');
    const [patrons, setPatrons] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patronsRes, booksRes] = await Promise.all([
                    axios.get('http://localhost:8080/patron'),
                    axios.get('http://localhost:8080/books')
                ]);
                setPatrons(Array.isArray(patronsRes.data) ? patronsRes.data : []);
                setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
            } catch (error) {
                toast.error('Failed to fetch patrons or books.');
            }
        };
        fetchData();
    }, []);


    const handleBorrow = async () => {
        if (!patronId || !bookId) {
            toast.error('Please select both Patron ID and Book ID.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/books/borrow', {
                patronId: parseInt(patronId),
                bookId: parseInt(bookId)
            });

            if (response.status === 200) {
                toast.success('Book borrowed successfully!');
                setPatronId('');
                setBookId('');
            }
        } catch (error) {
            toast.error('Failed to borrow book.');
        } finally {
            setLoading(false);
            navigate('/borrowed-books');
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md mt-20">
            <h2 className="text-blue-500 text-2xl font-bold mb-6 text-center">Borrow Book</h2>

            {patrons.length === 0 && (
                <div className="text-red-500 text-center mb-4">No patrons available. Please add a patron first.</div>
            )}

            {books.length === 0 && (
                <div className="text-red-500 text-center mb-4">No books available. Please add a book first.</div>
            )}

            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="patronId">
                    Select Patron
                </label>
                <select
                    id="patronId"
                    value={patronId}
                    onChange={(e) => setPatronId(e.target.value)}
                    className="text-black w-full border border-gray-300 px-3 py-2 rounded-md"
                    disabled={patrons.length === 0}
                >
                    <option value="">Select Patron</option>
                    {patrons.map((patron) => (
                        <option key={patron.id} value={patron.id}>
                            {patron.id} - {patron.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="bookId">
                    Select Book
                </label>
                <select
                    id="bookId"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                    className="text-black w-full border border-gray-300 px-3 py-2 rounded-md"
                    disabled={books.length === 0}
                >
                    <option value="">Select Book</option>
                    {books.map((book) => (
                        <option key={book.id} value={book.id}>
                            {book.id} - {book.title}
                        </option>
                    ))}
                </select>
            </div>

            <Button
                onClick={handleBorrow}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={loading || patrons.length === 0 || books.length === 0}
            >
                {loading ? 'Processing...' : 'Borrow Book'}
            </Button>
        </div>
    );
};

export default BorrowBook;
