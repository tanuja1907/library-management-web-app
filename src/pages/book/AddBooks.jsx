import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AddBooks() {
  const form = useForm({
    defaultValues: {
      title: "",
      author: "",
      availableCopies: 1,
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const bookData = {
      ...data,
      availableCopies: parseInt(data.availableCopies, 10),
    };
    try {
      await axios.post("http://localhost:8080/books", bookData);
      toast.success("Book added successfully!");
      form.reset();
      navigate("/allBooks");
    } catch (err) {
      console.error("Error adding book:", err);
      toast.error("Failed to add book!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-blue-700">
          📚 Add New Book
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-blue-700">

              {/* Book Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter book title"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Author */}
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter author name"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Available Copies */}
              <FormField
                control={form.control}
                name="availableCopies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Copies</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        placeholder="Enter number of copies"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button type="submit" className="w-full border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white transition duration-300">
                Add Book
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
