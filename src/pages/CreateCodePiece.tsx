
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { api, CreateCodePieceRequest } from "@/services/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CodeEditor from "@/components/CodeEditor";
import { toast } from "sonner";

// Languages supported
const LANGUAGES = [
  "C",
  "Java",
  "Python",
  "PHP",
  "Dart",
  "Swift",
  "Kotlin",
  "JavaScript",
  "TypeScript",
  "C++",
  "C#",
  "Ruby",
  "Go",
  "Other",
];

// Validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  language: z.string().min(1, "Language is required"),
  custom_language: z.string().optional(),
  code: z.string().min(1, "Code is required"),
  owner_name: z.string().min(1, "Owner name is required"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCodePiece: React.FC = () => {
  const navigate = useNavigate();
  const { spaceId } = useParams<{ spaceId: string }>();
  const [showCustomLanguage, setShowCustomLanguage] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      language: "",
      custom_language: "",
      code: "",
      owner_name: "",
      password: "",
    },
  });

  const createCodePieceMutation = useMutation({
    mutationFn: (data: CreateCodePieceRequest) => api.createCodePiece(data),
    onSuccess: () => {
      toast.success("Code piece created successfully");
      navigate(`/spaces/${spaceId}`);
    },
    onError: () => {
      toast.error("Failed to create code piece");
    },
  });

  const onSubmit = (data: FormValues) => {
    const finalLanguage = data.language === "Other" ? data.custom_language || "Other" : data.language;
    
    const requestData: CreateCodePieceRequest = {
      space_id: Number(spaceId),
      name: data.name,
      description: data.description,
      language: finalLanguage,
      code: data.code,
      owner_name: data.owner_name,
      password: data.password,
    };
    
    createCodePieceMutation.mutate(requestData);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">
        Create New Code Piece
      </h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Code Piece" {...field} />
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
          </div>
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Describe your code piece..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowCustomLanguage(value === "Other");
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {showCustomLanguage && (
              <FormField
                control={form.control}
                name="custom_language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Language</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter language name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className={showCustomLanguage ? "md:col-span-2" : ""}>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Controller
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                      <CodeEditor
                        code={field.value}
                        language={form.watch("language") || "text"}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-4 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/spaces/${spaceId}`)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-primary" 
              disabled={createCodePieceMutation.isPending}
            >
              {createCodePieceMutation.isPending ? "Creating..." : "Create Code Piece"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCodePiece;
