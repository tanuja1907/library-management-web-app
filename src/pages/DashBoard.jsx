import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Users, BookOpen, BookMinus, BookPlus } from 'lucide-react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/books/stats/summary');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      label: 'Total Books',
      value: stats?.totalBooks,
      icon: <BookOpen className="w-8 h-8 text-white" />,
      color: 'bg-blue-600',
    },
    {
      label: 'Borrowed Books',
      value: stats?.borrowedBooks,
      icon: <BookMinus className="w-8 h-8 text-white" />,
      color: 'bg-red-500',
    },
    {
      label: 'Available Books',
      value: stats?.availableBooks,
      icon: <BookPlus className="w-8 h-8 text-white" />,
      color: 'bg-green-500',
    },
    {
      label: 'Total Patrons',
      value: stats?.totalPatrons,
      icon: <Users className="w-8 h-8 text-white" />,
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h2 className="text-4xl font-bold text-center text-white mb-10">
        📚 Library Dashboard
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 shadow-lg text-white flex items-center justify-between ${card.color}`}
            >
              <div>
                <h4 className="text-xl font-semibold">{card.label}</h4>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div>{card.icon}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
