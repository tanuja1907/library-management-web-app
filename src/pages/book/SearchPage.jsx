import { useState } from "react";
import axios from "axios";
 

function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);
    const [patrons, setPatrons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        setLoading(true);
        setError("");
        setBooks([]);
        setPatrons([]);
    
        try {
            const booksResponse = await axios.get(`http://localhost:8080/books/search?term=${encodeURIComponent(searchTerm)}`);
            setBooks(booksResponse.data);
        } catch (err) {
            setBooks([]);
            if (err.response?.status !== 404) {
                setError("Error fetching books.");
            }
        }
    
        try {
            const patronsResponse = await axios.get(`http://localhost:8080/patron/search?pattern=${encodeURIComponent(searchTerm)}`);
            setPatrons(patronsResponse.data);
        } catch (err) {
            setPatrons([]);
            if (err.response?.status !== 404) {
                setError("Error fetching patrons.");
            }
        }
    
        setLoading(false);
    };
    
    

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center">🔍 Search Books & Patrons</h1>

            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter book title or patron name..."
                    className="bg-white text-black p-2 border rounded w-full hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <button
                    onClick={handleSearch}
                    disabled={!searchTerm.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Search
                </button>
            </div>

            {loading && <p className="text-center text-gray-600">Loading...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {books.length > 0 && (
                <div className="mb-8 ">
                    <h2 className="text-xl font-semibold mb-2">Books:</h2>
                    <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {books.map((book) => (
                            <div key={book.id} className="p-4 bg-white rounded shadow hover:shadow-lg transition-all">
                                <h3 className="text-lg font-bold mb-1">📖 {book.title}</h3>
                                <p className=" dark:text-black">Author: {book.author}</p>
                                <p className={`mt-1 text-sm ${book.availableCopies > 0 ? "text-green-600" : "text-red-500"}`}>
                                    {book.availableCopies > 0
                                        ? `Available Copies: ${book.availableCopies}`
                                        : "Currently Unavailable"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {patrons.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Patrons:</h2>
                    <ul className="space-y-4">
                        {patrons.map((patron) => (
                            <li key={patron.id} className="p-4 bg-white  rounded shadow">
                                <div className="font-medium text-lg">🧑 {patron.name} </div>

                                {patron.borrowedBooks && patron.borrowedBooks.length > 0 ? (
                                    <div className="mt-2">
                                        <div className="font-semibold">📚 Borrowed Books:</div>
                                        <ul className="list-disc list-inside">
                                            {patron.borrowedBooks.map((book) => (
                                                <li key={book.id}>
                                                    {book.title} by {book.author} {book.availableCopies === 0 && "(Currently Unavailable)"}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <div className="text-sm text-gray-500 mt-2">No borrowed books</div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}

export default SearchPage;
