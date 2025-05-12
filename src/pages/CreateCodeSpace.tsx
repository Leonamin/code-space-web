
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
  name: z.string().min(1, "이름은 필수 항목입니다."),
  description: z.string().optional(),
  owner_name: z.string().min(1, "작성자는 필수항목입니다."),
  password: z.string().min(4, "비밀번호는 최소 4자리 이상이어야합니다."),
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
      toast.success("코드스페이스 생성 성공!");
      navigate("/");
    },
    onError: () => {
      toast.error("코드스페이스 생성 실패");
    },
  });

  const onSubmit = (data: FormValues) => {
    createCodeSpaceMutation.mutate(data);
  };

  return (
    <div className="container max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">새로운 코드스페이스 생성</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="코드스페이스" {...field} />
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
                <FormLabel>설명 (선택)</FormLabel>
                <FormControl>
                  <Textarea placeholder="코드 스페이스 설명" {...field} />
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
                <FormLabel>작성자</FormLabel>
                <FormControl>
                  <Input placeholder="햄스터" {...field} />
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
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              취소
            </Button>
            <Button type="submit" className="bg-primary" disabled={createCodeSpaceMutation.isPending}>
              {createCodeSpaceMutation.isPending ? "생성중" : "코드스페이스 생성"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCodeSpace;
