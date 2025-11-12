import { apiFetch } from "./api";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read";
  createdAt: string;
};

export async function listContactMessages(): Promise<ContactMessage[]> {
  return apiFetch("/contact", { method: "GET" });
}

export async function markContactMessageRead(id: string): Promise<ContactMessage> {
  return apiFetch(`/contact/${id}/read`, { method: "PATCH" });
}
