import { useEffect, useState } from "react";
import { listContactMessages, markContactMessageRead, ContactMessage } from "@/services/contact";

const ContactMessages = () => {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listContactMessages();
      setItems(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onMarkRead = async (id: string) => {
    try {
      await markContactMessageRead(id);
      await load();
    } catch (e: any) {
      alert(e.message ?? "Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Contact Messages</h1>
      </div>
      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Message</th>
              <th className="text-left p-2">Received</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(m => (
              <tr key={m.id} className="border-t align-top">
                <td className="p-2">
                  <span className={m.status === 'new' ? 'text-emerald-600' : 'text-muted-foreground'}>
                    {m.status}
                  </span>
                </td>
                <td className="p-2">{m.name}</td>
                <td className="p-2">{m.email}</td>
                <td className="p-2 whitespace-pre-wrap max-w-[500px]">{m.message}</td>
                <td className="p-2">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="p-2 text-right space-x-2">
                  {m.status !== 'read' && (
                    <button className="underline" onClick={() => onMarkRead(m.id)}>Mark read</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactMessages;
