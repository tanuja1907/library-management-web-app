import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AddPatrons = () => {
  const [name, setName] = useState('');
  const [profession, setProfession] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPatron = { name, profession };
      await axios.post('http://localhost:8080/patron', newPatron);
      toast.success('Patron added successfully!');
      navigate('/allPatrons');
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      if (backendMessage) {
        toast.error(backendMessage, { duration: 2000 });
      } else {
        toast.error('Failed to add patron!', { duration: 2000 });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg p-10 rounded-2xl shadow-2xl border border-blue-100">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-8 drop-shadow-sm">
          🎟️ Add New Patron
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-blue-800 mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800"
              placeholder="Enter patron's name"
              required
            />
          </div>



          <div>
            <label htmlFor="profession" className="block text-lg font-medium text-blue-800 mb-2">Profession</label>
            <input
              type="text"
              id="profession"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              className="w-full p-4 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800"
              placeholder="Enter patron's profession"
              required
            />
          </div>

          <div className="text-center">
            <Button
              type="submit"
              variant="default"
              className="mt-6 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg font-bold rounded-full transition-transform transform hover:scale-105"
            >
              ➕ Add Patron
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatrons;
