import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/services/api";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "CodeSpace 이름은 2글자 이상이어야 합니다.",
  }),
  description: z.string().optional(),
  password: z.string().optional(),
  owner_name: z.string().optional(),
});

const CreateCodeSpace: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      password: "",
      owner_name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating(true);
    try {
      if (values.name) {
        await api.createCodeSpace({
          name: values.name,
          description: values.description || "",
          password: values.password || "",
          owner_name: values.owner_name || "",
        });
        toast({
          title: "CodeSpace 생성 완료",
          description: "CodeSpace가 성공적으로 생성되었습니다.",
        });
        navigate("/");
      } else {
        toast({
          title: "CodeSpace 생성 실패",
          description: "CodeSpace 이름을 입력해주세요.",
        });
      }
    } catch (error) {
      toast({
        title: "CodeSpace 생성 실패",
        description: "CodeSpace 생성 중 오류가 발생했습니다.",
      });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Create CodeSpace</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-lg"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="CodeSpace 이름을 입력하세요" {...field} />
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="CodeSpace에 대한 설명을 입력하세요"
                    {...field}
                  />
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
                  <Input
                    type="password"
                    placeholder="CodeSpace 비밀번호를 입력하세요"
                    {...field}
                  />
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
                  <Input placeholder="소유자 이름을 입력하세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating..." : "Create CodeSpace"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateCodeSpace;
