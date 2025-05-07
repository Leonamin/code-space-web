
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { api, CreateCodeSpaceRequest } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  owner_name: z.string().min(1, "Owner name is required"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCodeSpace: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      owner_name: "",
      password: "",
    },
  });

  const createCodeSpaceMutation = useMutation({
    mutationFn: (data: CreateCodeSpaceRequest) => api.createCodeSpace(data),
    onSuccess: () => {
      toast.success("CodeSpace created successfully");
      navigate("/");
    },
    onError: () => {
      toast.error("Failed to create CodeSpace");
    },
  });

  const onSubmit = (data: FormValues) => {
    createCodeSpaceMutation.mutate(data);
  };

  return (
    <div className="container max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">Create New CodeSpace</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="My CodeSpace" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your CodeSpace..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="owner_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Owner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary" disabled={createCodeSpaceMutation.isPending}>
              {createCodeSpaceMutation.isPending ? "Creating..." : "Create CodeSpace"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCodeSpace;
