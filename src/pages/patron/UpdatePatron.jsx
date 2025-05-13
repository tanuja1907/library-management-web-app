import React, { useEffect } from 'react'
import { useForm} from 'react-hook-form';
import axios from 'axios';
import { Form, FormField, FormLabel ,FormControl,FormMessage} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from 'react-router-dom';


const UpdatePatron = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 
  const form = useForm({
    defaultValues: {
      name: "",
      profession: "",
    },
  });
  const { control, handleSubmit, reset ,setValue} = form;

  useEffect(() => {
    console.log("ID:", id);
    if(id){
    axios.get(`http://localhost:8080/patron/${id}`)
      .then((res) => {
        reset(res.data);
        console.log("Fetched book data:", res.data);
      }).catch((err) => {
        console.error("Error fetching book data:", err);
      })
    }
  }, [id, reset]);

  const handleUpdate = async (data) => {
    const bookData = {
      ...data,
    };
    try {
      const response=await axios.patch(`http://localhost:8080/patron/${id}`, bookData);
      console.log("backend Response:", response.data);
      toast.success("patron updated successfully!");
      navigate("/allPatrons", { state: { bookUpdated: true } });
      console.log("Book updated successfully!");
    } catch (err) {
      console.error("Error updating book:", err);
      toast.error(err.response ? data?.message || "failed to update book!" : "Failed to update book!");
    }
  }


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className='max-w-md w-full bg-white p-8 rounded-xl shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-center text-gray-700'>Update Patron</h2>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleUpdate)} className='space-y-6'>
          <FormField
            name="name"
            control={control}
            render={({ field }) => (
              <>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field}
                  className="border-gray-300 text-black hover:border-blue-500 focus:border-blue-600 transition duration-300" 
                  required />
                </FormControl>
                <FormMessage />
              </>
            )}

          />

          

          

          <FormField
            name="profession"
            control={control}
            render={({ field }) => (
              <>
                <FormLabel>Profession</FormLabel>
                <FormControl>
                  <Input  {...field} 
                  className="border-gray-300 text-black hover:border-blue-500 focus:border-blue-600 transition duration-300" 
                  required />
                </FormControl>
                <FormMessage />
              </>
            )}
          />

          <Button type="submit" variant="default" className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300">Update Patron</Button>
        </form>
      </Form>
      </div>
    </div>
  )
}

export default UpdatePatron
