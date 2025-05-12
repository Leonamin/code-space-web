
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api, UpdateCodeSpaceRequest } from "@/services/api";
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

const EditCodeSpace: React.FC = () => {
  const navigate = useNavigate();
  const { spaceId } = useParams<{ spaceId: string }>();
  const [returnToDetails, setReturnToDetails] = useState(false);

  // Load the code piece
  const { data: codeSpace, isLoading } = useQuery({
    queryKey: ["codeSpace", spaceId],
    queryFn: () => api.getCodeSpaceDetail(Number(spaceId)),
    meta: {
      onSettled: (_, error) => {
        if (error) {
          toast.error("코드스페이스를 불러오는데 실패했습니다.");
          navigate(-1);
        }
      },
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      owner_name: "",
      password: "",
    },
  });

  useEffect(() => {
    if (codeSpace) {
      form.reset({
        name: codeSpace.name,
        description: codeSpace.description || "",
        owner_name: codeSpace.owner_name,
      })
    }
  }, [
    codeSpace, form
  ])

  const updateCodeSpaceMutation = useMutation({
    mutationFn: (data: UpdateCodeSpaceRequest) => api.updateCodeSpace(Number(spaceId), data),
    onSuccess: () => {
      toast.success("코드스페이스가 수정되었습니다");
      if (returnToDetails) {
        navigate(`/spaces/${spaceId}`);
      } else {
        navigate("/");
      }
    },
    onError: () => {
      toast.error("수정에 실패했습니다. 비밀번호를 확인해주세요.");
    },
  });

  const onSubmit = (data: FormValues) => {
    updateCodeSpaceMutation.mutate({
      name: data.name,
      description: data.description,
      owner_name: data.owner_name,
      password: data.password,
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">코드스페이스 수정</h1>

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
                  <Input type="password" placeholder="비밀번호" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex space-x-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              취소
            </Button>
            <Button type="submit" className="bg-primary" disabled={updateCodeSpaceMutation.isPending} onClick={() => setReturnToDetails(false)}>
              {updateCodeSpaceMutation.isPending ? "수정중" : "수정 완료"}
            </Button>
            <Button type="submit" className="bg-primary" disabled={updateCodeSpaceMutation.isPending} onClick={() => setReturnToDetails(true)}>
              {updateCodeSpaceMutation.isPending ? "수정중" : "수정 후 상세보기"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditCodeSpace;