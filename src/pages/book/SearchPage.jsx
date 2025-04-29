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

        try {
            const [booksResponse, patronsResponse] = await Promise.all([
                axios.get(`http://localhost:8080/books/search?term=${searchTerm}`),
                axios.get(`http://localhost:8080/patron/search?pattern=${searchTerm}`)
            ]);

            setBooks(booksResponse.data);
            setPatrons(patronsResponse.data);
        } catch (err) {
            setError("No matching books or patrons found.");
            setBooks([]);
            setPatrons([]);
        }

        setLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">🔍 Search Books & Patrons</h1>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter book title or patron name..."
                    className="bg-white text-black p-2 border rounded w-full hover:border-blue-500 hover:bg-amber-100 "
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Search
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

           
            {books.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Books:</h2>
                    <ul className="space-y-2">
                        {books.map((book) => (
                            <li key={book.id} className="p-2 bg-white dark:bg-gray-800 rounded shadow">
                                📚 {book.title} by {book.author}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            
            {patrons.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Patrons:</h2>
                    <ul className="space-y-2">
                        {patrons.map((patron) => (
                            <li key={patron.id} className="p-2 bg-white dark:bg-gray-800 rounded shadow">
                                🧑 {patron.name}  
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchPage;
