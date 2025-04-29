import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AddPatrons = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [profession, setProfession] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newPatron = { name, age, profession };
            await axios.post('http://localhost:8080/patron', newPatron);
            toast.success('Patron added successfully!');
            navigate('/patrons/allPatrons'); // Redirect to patrons list page after successful addition
        } catch (err) {
            console.error('Error adding patron:', err);
            toast.error('Failed to add patron!');
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 ">Add New Patron</h1>
            <form onSubmit={handleSubmit} className='space-y-56'>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-black mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                        type="number"
                        id="age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="text-black mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
                    <input
                        type="text"
                        id="profession"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        className="text-black mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500"
                        required
                    />
                </div>
                <Button type="submit" variant="outline" className='mt-4 py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-lg'>Add Patron</Button>
            </form>
        </div>
    );
};

export default AddPatrons;
