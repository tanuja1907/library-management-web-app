import { BrowserRouter as Router, Routes, Route, Link, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddPatrons from "./pages/patron/AddPatrons";
import AddBooks from "./pages/book/AddBooks";
import UpdateBook from "./pages/book/UpdateBook";
import GetAllBooks from "./pages/book/GetAllBooks";
import { Toaster } from "./components/ui/sonner";
import GetAllPatrons from "./pages/patron/GetAllPatrons";
import UpdatePatron from "./pages/patron/UpdatePatron";
import BorrowBook from "./pages/book/BorrowBook";
import AllBorrowedBooks from "./pages/book/AllBorrowedBooks";
import SearchPage from "./pages/book/SearchPage";
function App() {
    return (
        <Router>
            <div className="flex min-h-screen">
                <aside className="w-64 bg-gray-900 text-white p-4">
                    <h2 className="text-xl font-bold mb-6">Library Management System</h2>
                    <nav className="space-y-2">
                        <NavLink to="/"
                         className={({ isActive }) => `block hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/books"
                         className={({ isActive }) => `block hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`}>
                            Add Book
                        </NavLink>
                        <NavLink
                            to="/books/allBooks"
                            className={({ isActive }) => `block hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`}
                        >
                            View All Books
                        </NavLink>
                        <NavLink
                            to="/patrons"
                            className={({ isActive }) => `block hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`}
                        >
                            Add Patron
                        </NavLink>
                        <NavLink
                            to="/patrons/allPatrons"
                            className={({ isActive }) => `block hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`}
                        >
                            View All Patron
                        </NavLink>
                        <NavLink
                            to="/borrow"
                            className={({ isActive }) => `block hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`}
                        >
                            Borrow Book
                        </NavLink>
                        <NavLink
                            to="/borrowed-books"
                            className={({ isActive }) => `block hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`}
                        >
                            Borrowed Books
                        </NavLink>
                        <NavLink
                            to="/search"
                            className={({ isActive }) => `block hover:text-blue-400 ${isActive ? 'text-blue-400' : ''}`}
                        >
                              <span>🔍</span> Search
                        </NavLink>
                    </nav>
                </aside>

                <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-white">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/books" element={<AddBooks />} />
                        <Route path="/books/allBooks" element={<GetAllBooks />} />
                        <Route path="/update-book/:id" element={<UpdateBook />} />
                        <Route path="/patrons" element={<AddPatrons />} />
                        <Route path="/patrons/allPatrons" element={<GetAllPatrons/>} />
                        <Route path="/update-patron/:id" element={<UpdatePatron/>} />
                        <Route path="/borrow" element={<BorrowBook/>} />
                        <Route path="/borrowed-books" element={<AllBorrowedBooks/>} />
                        <Route path="/search" element={<SearchPage/>} />
                    </Routes>
                </main>
            </div>
            <Toaster position="top-center" richColors/>
        </Router>
    );
}

export default App;
