import { Button } from '@/components/ui/button';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const GetAllPatrons = () => {
  const [patrons, setPatrons] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const toastShownRef = useRef(false); // 👈 useRef to manage toast

  const fetchPatrons = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/patron');
      const fetchedPatrons = Array.isArray(res.data) ? res.data : [];
      setPatrons(fetchedPatrons);

      if (fetchedPatrons.length === 0 && !toastShownRef.current) {
        toast.dismiss(); // dismiss old toasts
        toast.warning('No patrons found!');
        toastShownRef.current = true;
      }
    } catch (err) {
      console.error('Error fetching patrons:', err);
      toast.dismiss();
      toast.error('Failed to fetch patrons!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (patronId) => {
    try {
      await axios.delete(`http://localhost:8080/patron/${patronId}`);
      toast.dismiss();
      toast.success('Patron deleted successfully!');
      toastShownRef.current = false; 
      fetchPatrons();
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      if(backendMessage)
      console.error('Error deleting patron:', err);
      toast.dismiss();
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Failed to delete patron!');
      }
    }
  };

  const handleAddNewPatron = () => {
    navigate('/patrons');
  };

  useEffect(() => {
    fetchPatrons();
    if (location.state?.patronAdded && !toastShownRef.current) {
      toast.dismiss();
      toast.success('Patron added successfully!');
      toastShownRef.current = true;
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="p-4">
      {patrons.length > 0 && (
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Patrons</h1>
          <Button onClick={handleAddNewPatron} variant="outline" className="border-white text-white hover:bg-white hover:text-blue-500">
            + Add New Patron
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        </div>
      ) : patrons.length === 0 ? (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">No Patrons Available.</h1>
          <Button
            onClick={handleAddNewPatron}
            variant="outline"
            className="mt-4 border-white text-white hover:bg-white hover:text-blue-500"
          >
            Add your first Patron
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto p-4">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-5 border-b border-gray-300 text-center">ID</th>
                <th className="p-5 border-b border-gray-300 text-center">Name</th>
                <th className="p-5 border-b border-gray-300 text-center">Profession</th>
                <th className="p-5 border-b border-gray-300 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patrons.map((patron) => (
                <tr key={patron.id} className="bg-white hover:bg-gray-50 transition border-t border-gray-300">
                  <td className="p-5 border-r border-gray-200 text-center">{patron.id}</td>
                  <td className="p-5 border-r border-gray-200 text-center">{patron.name}</td>
                  <td className="p-5 border-r border-gray-200 text-center">{patron.profession}</td>
                  <td className="p-5 flex justify-center gap-2">
                    <Button
                      onClick={() => navigate(`/update-patron/${patron.id}`)}
                      variant="outline"
                      className="hover:bg-blue-500"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(patron.id)}
                      variant="outline"
                      className="hover:border-red-500 hover:bg-red-500"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetAllPatrons;
