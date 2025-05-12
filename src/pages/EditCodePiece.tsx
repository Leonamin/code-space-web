
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api, CodePieceDetail } from "@/services/api";
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
import { ChevronLeft } from "lucide-react";

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

// Validation schema for edit form
const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  language: z.string().optional(),
  custom_language: z.string().optional(),
  code: z.string().optional(),
  owner_name: z.string().optional(),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const EditCodePiece: React.FC = () => {
  const navigate = useNavigate();
  const { pieceId } = useParams<{ pieceId: string }>();
  const [showCustomLanguage, setShowCustomLanguage] = useState(false);
  const [returnToDetails, setReturnToDetails] = useState(false);

  // Load the code piece
  const { data: codePiece, isLoading } = useQuery({
    queryKey: ["codePiece", pieceId],
    queryFn: () => api.getCodePieceDetail(Number(pieceId)),
    meta: {
      onSettled: (_, error) => {
        if (error) {
          toast.error("Failed to load code piece");
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
      language: "",
      custom_language: "",
      code: "",
      owner_name: "",
      password: "",
    },
  });

  // Set form values when code piece is loaded
  useEffect(() => {
    if (codePiece) {
      const isOtherLanguage = !LANGUAGES.some(
        (lang) => lang.toLowerCase() === codePiece.language.toLowerCase()
      );

      form.reset({
        name: codePiece.name,
        description: codePiece.description || "",
        language: isOtherLanguage ? "Other" : codePiece.language,
        custom_language: isOtherLanguage ? codePiece.language : "",
        code: codePiece.code,
        owner_name: codePiece.owner_name,
      });

      setShowCustomLanguage(isOtherLanguage);
    }
  }, [codePiece, form]);

  const updateCodePieceMutation = useMutation({
    mutationFn: (data: any) =>
      api.updateCodePiece(Number(pieceId), data),
    onSuccess: () => {
      toast.success("코드 피스가 수정되었습니다");
      if (returnToDetails) {
        navigate(`/pieces/${pieceId}`);
      } else {
        navigate(`/spaces/${codePiece?.space_id}`);
      }
    },
    onError: () => {
      toast.error("수정에 실패했습니다. 비밀번호를 확인해주세요.");
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!codePiece) return;

    const finalLanguage =
      data.language === "Other" ? data.custom_language || codePiece.language : data.language;

    const requestData: any = {
      password: data.password,
    };

    // Only include fields that have been changed
    if (data.name && data.name !== codePiece.name) requestData.name = data.name;
    if (data.description !== codePiece.description) requestData.description = data.description;
    if (finalLanguage !== codePiece.language) requestData.language = finalLanguage;
    if (data.code !== codePiece.code) requestData.code = data.code;
    if (data.owner_name && data.owner_name !== codePiece.owner_name) {
      requestData.owner_name = data.owner_name;
    }

    updateCodePieceMutation.mutate(requestData);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="flex items-center gap-2 mb-4"
      >
        <ChevronLeft size={16} /> 뒤로가기
      </Button>

      <h1 className="text-2xl font-bold mb-6 text-primary text-center">
        코드 피스 수정
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>이름</FormLabel>
                  <FormControl>
                    <Input placeholder="변경하지 않음" {...field} />
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
                  <FormLabel>작성자명</FormLabel>
                  <FormControl>
                    <Input placeholder="변경하지 않음" {...field} />
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
                <FormLabel>설명 (선택사항)</FormLabel>
                <FormControl>
                  <Textarea placeholder="변경하지 않음" {...field} />
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
                  <FormLabel>언어</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowCustomLanguage(value === "Other");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="변경하지 않음" />
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
                    <FormLabel>커스텀 언어</FormLabel>
                    <FormControl>
                      <Input placeholder="언어 이름 입력" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>코드</FormLabel>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="bg-primary"
              disabled={updateCodePieceMutation.isPending}
              onClick={() => setReturnToDetails(false)}
            >
              {updateCodePieceMutation.isPending ? "수정 중..." : "수정 완료"}
            </Button>
            <Button
              type="submit"
              className="bg-secondary"
              disabled={updateCodePieceMutation.isPending}
              onClick={() => setReturnToDetails(true)}
            >
              {updateCodePieceMutation.isPending ? "수정 중..." : "수정 후 상세보기"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditCodePiece;
