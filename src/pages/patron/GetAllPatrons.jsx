import { Card, CardContent } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const GetAllPatrons = () => {
    const [patrons, setPatrons] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [toastShown, setToastShown] = useState(false);

     
    const fetchPatrons = async () => {
        setLoading(true);
        try {
            const res = await axios.get("http://localhost:8080/patron");
            const fetchedPatrons = Array.isArray(res.data) ? res.data : [];
            if (fetchedPatrons.length === 0) {
                toast.warning("No patrons found!");
            }
            setPatrons(fetchedPatrons);
            console.log("Fetched patrons:", fetchedPatrons);
        } catch (err) {
            console.error("Error fetching patrons:", err);
            toast.error("Failed to fetch patrons!");
        } finally {
            setLoading(false);
        }
    };

  
    const handleDelete = async (patronId) => {
        try {
            await axios.delete(`http://localhost:8080/patron/${patronId}`);
            toast.success("Patron deleted successfully!");
            fetchPatrons();
        } catch (err) {
            console.error("Error deleting patron:", err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message); // Show backend's error message
            } else {
                toast.error("Failed to delete patron!");
            }
        }
    };

    
    const handleAddNewPatron = () => {
        navigate("/add-patron");
    };

    useEffect(() => {
        fetchPatrons();
        if (location.state?.patronAdded && !toastShown) {
            toast.success("Patron added successfully!");
            setToastShown(true);
            window.history.replaceState({}, document.title); // Clears the state after the toast
        }
    }, [location.state, toastShown]);

    return (
        <div className='p-4'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Patrons</h1>
                <Button onClick={handleAddNewPatron} variant="outline" className='mt-4'> + Add New Patron</Button>
            </div>
            {loading ? (
                <div className='flex justify-center items-center h-64'>
                    <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
                </div>
            ) : patrons.length === 0 ? (
                <div>
                    No Patrons Available.<br />
                    <Button onClick={handleAddNewPatron} variant="outline" className='mt-4'>Add your first Patron</Button>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {patrons.map((patron) => (
                        <Card key={patron.id}>
                            <CardContent className="p-4 space-y-2">
                                <h2 className='text-xl font-bold'>Id: {patron.id}</h2>
                                <p className='text-sm text-muted-foreground'>Name: {patron.name}</p>
                                <p className='text-sm text-muted-foreground'>Age: {patron.age}</p>
                                <p className='text-sm text-muted-foreground'>Profession: {patron.profession}</p>
                                <div className='flex gap-2 mt-2'>
                                    <Button onClick={() => navigate(`/update-patron/${patron.id}`)} variant="outline" className='hover:bg-blue-400'>Edit</Button>
                                    <Button onClick={() => handleDelete(patron.id)} variant="outline" className='hover:border-red-500 hover:bg-red-500'>Delete</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default GetAllPatrons;
