import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from 'react-router-dom';

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      title: '',
      author: '',
      availableCopies: 1
    }
  });

  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/books/${id}`)
        .then((res) => {
          reset(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching book data:", err);
          toast.error("Failed to load book data.");
          setLoading(false);
        });
    }
  }, [id, reset]);

  const handleUpdate = async (data) => {
    const bookData = {
      ...data,
      availableCopies: parseInt(data.availableCopies, 10)
    };

    try {
      await axios.patch(`http://localhost:8080/books/${id}`, bookData);
      toast.success("Book updated successfully!");
      setTimeout(() => {
        navigate("/allBooks", { state: { bookUpdated: true } });
      }, 500);
    } catch (err) {
      console.error("Error updating book:", err);
      toast.error(
        err.response?.data?.message || "Failed to update book!"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading book data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Update Book</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-6">
            <FormField
              name="title"
              control={control}
              render={({ field }) => (
                <>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-gray-300 text-black hover:border-blue-500 focus:border-blue-600 transition duration-300"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />

            <FormField
              name="author"
              control={control}
              render={({ field }) => (
                <>
                  <FormLabel>Author</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-gray-300 text-black hover:border-blue-500 focus:border-blue-600 transition duration-300"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />

            <FormField
              name="availableCopies"
              control={control}
              render={({ field }) => (
                <>
                  <FormLabel>Copies Available</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      className="border-gray-300 text-black hover:border-blue-500 focus:border-blue-600 transition duration-300"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </>
              )}
            />

            <Button
              type="submit"
              variant="default"
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
            >
              Update Book
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateBook;
