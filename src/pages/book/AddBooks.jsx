import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Form, FormField, FormItem, FormLabel,FormControl,FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    const navigate=useNavigate();
    const onSubmit = async (data) => {
        console.log("Form data:", data);
        const bookData={
            ...data,
            availableCopies: parseInt(data.availableCopies, 10), // Ensure it's a number
        }
        try {
            await axios.post("http://localhost:8080/books", bookData);
            form.reset();
            navigate("/books/allBooks", { state: { bookAdded: true } });
            console.log("Book added successfully!");
        } catch (err) {
            console.error("Error adding book:", err);
            toast.error("Failed to add book!");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormField
                name="availableCopies"
                control={form.control}
                render={({field}) =>(
                    <FormItem>
                        <FormLabel>Copies Available</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                placeholder="Enter number of copies"
                                min="1"
                                required
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>


                )}
                />

                <Button type="submit" variant="default" className="border border-amber-100 hover:bg-amber-100 text-amber-900 font-bold py-2 px-4 rounded">
                    Add Book
                </Button>
            </form>
        </Form>
    );
}
