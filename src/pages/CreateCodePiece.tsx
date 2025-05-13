
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
import { useTranslation } from "react-i18next";

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
  name: z.string().min(1, "이름은 필수 항목입니다."),
  description: z.string().optional(),
  language: z.string().min(1, "언어는 필수 항목입니다."),
  custom_language: z.string().optional(),
  code: z.string().min(1, "코드는 필수 항목입니다."),
  owner_name: z.string().min(1, "작성자는 필수 항목입니다."),
  password: z.string().min(4, "비밀번호는 최소 4자리 이상이어야합니다."),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCodePiece: React.FC = () => {
  const { t } = useTranslation();

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
        {t('codePiece.create.title')}
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
                    <Input placeholder="바움쿠헨" {...field} />
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
                    <Input placeholder="드워프 햄스터" {...field} />
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
                <FormLabel>설명 (선택)</FormLabel>
                <FormControl>
                  <Textarea placeholder="햄스터는 살아있는 밀웜을 좋아해요" {...field} />
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="언어 선택" />
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
                    <FormLabel>기타 언어</FormLabel>
                    <FormControl>
                      <Input placeholder="언어 입력" {...field} />
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
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="비밀번호" {...field} />
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
                <FormLabel>코드</FormLabel>
                <FormControl>
                  <Controller
                    name="code"
                    control={form.control}
                    render={({ field }) => (
                      <CodeEditor
                        code={field.value}
                        language={form.watch("language") || "plain text"}
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
              취소
            </Button>
            <Button
              type="submit"
              className="bg-primary"
              disabled={createCodePieceMutation.isPending}
            >
              {createCodePieceMutation.isPending ? "생성중..." : "생성하기"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCodePiece;
