import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

// UI-only admin payments manager. Data persisted in localStorage.
// Schema kept simple and flat for ease of use.

type PaymentRecord = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  order_template_id?: string;
  order_template_name?: string;
  order_notes?: string;
  amount: string; // e.g. "$2.99" or "₹199.00"
  currency?: string; // e.g. USD, INR
  payment_method: "card" | "upi" | "wallet" | "cash" | "other";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  transaction_id?: string;
  // Masked payment references (UI-only)
  card_brand?: string; // e.g. VISA, Mastercard
  card_last4?: string; // e.g. 4242
  upi_id_masked?: string; // e.g. j***@okhdfcbank
  utr?: string; // Bank UTR/Reference No.
};

const STORAGE_KEY = "admin_payments";

function loadPayments(): PaymentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePayments(items: PaymentRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

const emptyForm: PaymentRecord = {
  id: "",
  created_at: "",
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  order_template_id: "",
  order_template_name: "",
  order_notes: "",
  amount: "",
  currency: "",
  payment_method: "card",
  payment_status: "pending",
  transaction_id: "",
  card_brand: "",
  card_last4: "",
  upi_id_masked: "",
  utr: "",
};

const Payments = () => {
  const [items, setItems] = useState<PaymentRecord[]>([]);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<PaymentRecord | null>(null);

  useEffect(() => {
    setItems(loadPayments());
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((r) =>
      [
        r.customer_name,
        r.customer_email,
        r.customer_phone,
        r.order_template_name,
        r.amount,
        r.payment_method,
        r.payment_status,
        r.transaction_id,
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [items, filter]);

  const startNew = () => {
    const now = new Date().toISOString();
    setEditing({ ...emptyForm, id: crypto.randomUUID(), created_at: now });
  };

  const startEdit = (rec: PaymentRecord) => setEditing({ ...rec });

  const cancelEdit = () => setEditing(null);

  const saveEdit = () => {
    if (!editing) return;
    // simple validation
    if (!editing.customer_name || !editing.customer_email || !editing.amount) {
      alert("Name, Email and Amount are required");
      return;
    }
    const next = [...items];
    const idx = next.findIndex((x) => x.id === editing.id);
    if (idx >= 0) next[idx] = editing;
    else next.unshift(editing);
    setItems(next);
    savePayments(next);
    setEditing(null);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    savePayments(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payments</h1>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search..."
            className="border rounded px-2 py-1 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Button onClick={startNew} size="sm" variant="outline">New</Button>
        </div>
      </div>

      {editing && (
        <div className="border rounded p-4 grid md:grid-cols-2 gap-4 bg-card">
          <div>
            <label className="text-sm block">Customer Name *</label>
            <input className="w-full border rounded px-3 py-2" value={editing.customer_name}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), customer_name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Customer Email *</label>
            <input className="w-full border rounded px-3 py-2" type="email" value={editing.customer_email}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), customer_email: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Customer Phone</label>
            <input className="w-full border rounded px-3 py-2" value={editing.customer_phone}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), customer_phone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Template ID</label>
            <input className="w-full border rounded px-3 py-2" value={editing.order_template_id}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), order_template_id: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Template Name</label>
            <input className="w-full border rounded px-3 py-2" value={editing.order_template_name}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), order_template_name: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm block">Order Notes</label>
            <textarea className="w-full border rounded px-3 py-2" rows={2} value={editing.order_notes}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), order_notes: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Amount *</label>
            <input className="w-full border rounded px-3 py-2" placeholder="$2.99 / ₹199.00" value={editing.amount}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), amount: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Currency</label>
            <input className="w-full border rounded px-3 py-2" placeholder="USD / INR" value={editing.currency}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), currency: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Payment Method</label>
            <select className="w-full border rounded px-3 py-2" value={editing.payment_method}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), payment_method: e.target.value as PaymentRecord["payment_method"] })}>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
              <option value="cash">Cash</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* Masked card fields */}
          <div>
            <label className="text-sm block">Card Brand</label>
            <input className="w-full border rounded px-3 py-2" placeholder="VISA / Mastercard" value={editing.card_brand}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), card_brand: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Card Last 4</label>
            <input className="w-full border rounded px-3 py-2" placeholder="4242" value={editing.card_last4}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), card_last4: e.target.value.replace(/\D/g, '').slice(0,4) })} />
          </div>
          {/* UPI and UTR */}
          <div>
            <label className="text-sm block">UPI ID (masked)</label>
            <input className="w-full border rounded px-3 py-2" placeholder="j***@okhdfcbank" value={editing.upi_id_masked}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), upi_id_masked: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">UTR / Reference No.</label>
            <input className="w-full border rounded px-3 py-2" placeholder="e.g. 234567890ABC" value={editing.utr}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), utr: e.target.value })} />
          </div>
          <div>
            <label className="text-sm block">Payment Status</label>
            <select className="w-full border rounded px-3 py-2" value={editing.payment_status}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), payment_status: e.target.value as PaymentRecord["payment_status"] })}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="text-sm block">Transaction ID</label>
            <input className="w-full border rounded px-3 py-2" value={editing.transaction_id}
              onChange={(e) => setEditing({ ...(editing as PaymentRecord), transaction_id: e.target.value })} />
          </div>

          <div className="md:col-span-2 flex items-center justify-end gap-2">
            <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
            <Button type="button" onClick={saveEdit}>Save</Button>
          </div>
        </div>
      )}

      <div className="border rounded overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Customer</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Template</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Method</th>
              <th className="text-left p-2">Card</th>
              <th className="text-left p-2">UPI</th>
              <th className="text-left p-2">Status</th>
              <th className="text-right p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-2">{r.customer_name}</td>
                <td className="p-2">{r.customer_email}</td>
                <td className="p-2">{r.order_template_name || r.order_template_id || "-"}</td>
                <td className="p-2">{r.amount}</td>
                <td className="p-2 capitalize">{r.payment_method}</td>
                <td className="p-2">{r.card_brand ? `${r.card_brand} •••• ${r.card_last4 || ""}` : "-"}</td>
                <td className="p-2">{r.upi_id_masked || "-"}</td>
                <td className="p-2 capitalize">{r.payment_status}</td>
                <td className="p-2 text-right space-x-2">
                  <button className="underline" onClick={() => startEdit(r)}>Edit</button>
                  <button className="text-red-600 underline" onClick={() => remove(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td className="p-4 text-center text-muted-foreground" colSpan={8}>No payment records</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
