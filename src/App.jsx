import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
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
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-cyan-700">
        
         
        <header className="  bg-blue-500  text-white h-20 flex items-center justify-center shadow-lg  ">
          <h1 className="text-3xl font-bold tracking-wide">📚 Library Management System 📚</h1>
        </header>

        
        <div className="flex flex-1">
          
          {/* Sidebar */}
          <aside className="w-64 bg-amber-100 text-black p-6 shadow-xl">
            <nav className="flex flex-col gap-4">
              <SidebarLink to="/" label="🏠 Dashboard" />
              <SidebarLink to="/books" label="➕ Add Book" />
              <SidebarLink to="/allBooks" label="📚 View All Books" />
              <SidebarLink to="/patrons" label="🧑‍🤝‍🧑 Add Patron" />
              <SidebarLink to="/allPatrons" label="👀 View All Patrons" />
              <SidebarLink to="/borrow" label="📖 Borrow Book" />
              <SidebarLink to="/borrowed-books" label="🔖 Borrowed Books" />
              <SidebarLink to="/search" label="🔍 Search" />
            </nav>
          </aside>

           
          <main className="flex-1 p-6 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/books" element={<AddBooks />} />
              <Route path="/allBooks" element={<GetAllBooks />} />
              <Route path="/update-book/:id" element={<UpdateBook />} />
              <Route path="/patrons" element={<AddPatrons />} />
              <Route path="/allPatrons" element={<GetAllPatrons />} />
              <Route path="/update-patron/:id" element={<UpdatePatron />} />
              <Route path="/borrow" element={<BorrowBook />} />
              <Route path="/borrowed-books" element={<AllBorrowedBooks />} />
              <Route path="/search" element={<SearchPage />} />
            </Routes>
          </main>

        </div>

        {/* Toaster Notifications */}
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}

 
function SidebarLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-4 py-3 rounded-lg border-2 border-blue-400 font-semibold text-lg text-center transition-all duration-300
         ${isActive ? "bg-blue-400 text-white" : "hover:bg-blue-300 hover:scale-105"}`
      }
    >
      {label}
    </NavLink>
  );
}

export default App;
