import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const ReturnBook = () => {
    const [patronId, setPatronId] = useState('');
    const [bookId, setBookId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReturn = async () => {
        if (!patronId || !bookId) {
            toast.error('Please fill in both Patron ID and Book ID.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/books/return', {
                patronId: parseInt(patronId),
                bookId: parseInt(bookId)
            });

            if (response.status === 200) {
                toast.success('Book returned successfully!');
                setPatronId('');
                setBookId('');
            }
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                 
                let errorMessage = '';
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (typeof data === 'object' && data.message) {
                    errorMessage = data.message;
                }

                if (status === 404) {
                    if (errorMessage.toLowerCase().includes('patron')) {
                        toast.error('Patron not found! Please check the Patron ID.');
                    } else if (errorMessage.toLowerCase().includes('book id')) {
                        toast.error('Book not found! Please check the Book ID.');
                    } else if (errorMessage.toLowerCase().includes('not borrowed')) {
                        toast.error('This book was not borrowed by you!');
                    }
                } else {
                    toast.error(errorMessage || 'Something went wrong. Please try again.');
                }
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-blue-500 text-2xl font-bold mb-6 text-center">Return Book</h2>
            
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="patronId">
                    Patron ID
                </label>
                <input
                    type="number"
                    id="patronId"
                    value={patronId}
                    onChange={(e) => setPatronId(e.target.value)}
                    className="text-black w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Patron ID"
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="bookId">
                    Book ID
                </label>
                <input
                    type="number"
                    id="bookId"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                    className="text-black w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Book ID"
                />
            </div>

            <Button
                onClick={handleReturn}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={loading}
            >
                {loading ? 'Processing...' : 'Return Book'}
            </Button>
        </div>
    );
};

export default ReturnBook;
