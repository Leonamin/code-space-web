import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
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
const formSchema = (t: (key: string, options?: any) => string) => z.object({
  name: z.string().min(1, t('validation.required', { field: t('common.name') })),
  description: z.string().optional(),
  owner_name: z.string().min(1, t('validation.required', { field: t('common.author') })),
  password: z.string().min(4, t('validation.password')),
});

type FormValues = z.infer<ReturnType<typeof formSchema>>;

const CreateCodeSpace: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      name: "",
      description: "",
      owner_name: "",
      password: "",
    },
  });

  const createCodeSpaceMutation = useMutation({
    mutationFn: (data: FormValues) => {
      const requestData: CreateCodeSpaceRequest = {
        name: data.name,
        description: data.description || "",
        owner_name: data.owner_name,
        password: data.password,
      };
      return api.createCodeSpace(requestData);
    },
    onSuccess: () => {
      toast.success(t('common.success.created'));
      navigate("/");
    },
    onError: () => {
      toast.error(t('common.errors.createFailed'));
    },
  });

  const onSubmit = (data: FormValues) => {
    createCodeSpaceMutation.mutate(data);
  };

  return (
    <div className="container max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-primary text-center">{t('codeSpace.create.title')}</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('common.name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('codeSpace.create.namePlaceholder')} {...field} />
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
                <FormLabel>{t('common.description')} ({t('common.optional')})</FormLabel>
                <FormControl>
                  <Textarea placeholder={t('codeSpace.create.descriptionPlaceholder')} {...field} />
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
                <FormLabel>{t('common.author')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('codeSpace.create.authorPlaceholder')} {...field} />
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
                <FormLabel>{t('common.password')}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t('common.passwordPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-4 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => navigate("/")}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" className="bg-primary" disabled={createCodeSpaceMutation.isPending}>
              {createCodeSpaceMutation.isPending ? t('codeSpace.create.submitting') : t('codeSpace.create.submit')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCodeSpace;
