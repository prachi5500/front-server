import { apiFetch, apiUpload } from "@/services/api";

export type Template = {
  id: string;
  name: string;
  status: "draft" | "published";
  config: any;
  background_url: string | null;
  back_background_url?: string | null;
  thumbnail_url: string | null;
  price?: number;          
  created_by?: string;
  created_at?: string;
  updated_at?: string;
};

export const listPublishedTemplates = async () => {
  const data = await apiFetch("/templates");
  return data as Template[];
};

export const listAllTemplates = async () => {
  const data = await apiFetch("/templates/all");
  return data as Template[];
};

export const getTemplate = async (id: string) => {
  const data = await apiFetch(`/templates/${id}`);
  return data as Template;
};

export const createTemplate = async (values: Partial<Template>) => {
  const data = await apiFetch("/templates", {
    method: "POST",
    body: JSON.stringify(values),
  });
  return data as Template;
};

export const updateTemplate = async (id: string, values: Partial<Template>) => {
  const data = await apiFetch(`/templates/${id}`, {
    method: "PUT",
    body: JSON.stringify(values),
  });
  return data as Template;
};

export const deleteTemplate = async (id: string) => {
  await apiFetch(`/templates/${id}`, { method: "DELETE" });
};

export const uploadTemplateAsset = async (file: File, path: string) => {
  const res = await apiUpload("/upload", file);
  return res.url as string;
};
