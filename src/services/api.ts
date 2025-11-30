// const BASE = import.meta.env.VITE_API_BASE as string;

// function getToken() {
//   try {
//     return localStorage.getItem('token');
//   } catch {
//     return null;
//   }
// }

// export async function apiFetch(path: string, opts: RequestInit = {}) {
//   const headers: Record<string, string> = {
//     'Content-Type': 'application/json',
//     ...(opts.headers as Record<string, string> | undefined),
//   };
//   const token = getToken();
//   if (token) headers['Authorization'] = `Bearer ${token}`;
//   const res = await fetch(`${BASE}${path}`, { ...opts, headers });
//   if (!res.ok) {
//     let msg = `HTTP ${res.status}`;
//     try {
//       const j = await res.json();
//       msg = j.error || msg;
//     } catch {}
//     throw new Error(msg);
//   }
//   if (res.status === 204) return null;
//   const ct = res.headers.get('content-type') || '';
//   return ct.includes('application/json') ? res.json() : res.text();
// }

// export async function apiUpload(path: string, file: File) {
//   const token = getToken();
//   const form = new FormData();
//   form.append('file', file);
//   const res = await fetch(`${BASE}${path}`, {
//     method: 'POST',
//     body: form,
//     headers: token ? { Authorization: `Bearer ${token}` } : undefined,
//   });
//   if (!res.ok) {
//     let msg = `HTTP ${res.status}`;
//     try {
//       const j = await res.json();
//       msg = j.error || msg;
//     } catch {}
//     throw new Error(msg);
//   }
//   return res.json();
// }



const BASE = import.meta.env.VITE_API_BASE as string;

function getToken() {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
}


export async function apiFetch(path: string, opts: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> | undefined),
  };

  // ⛔ Do NOT attach JWT for reset-password route
  const token = getToken();
  if (token && !path.includes("reset-password")) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j.error || msg;
    } catch {}
    throw new Error(msg);
  }

  if (res.status === 204) return null;

  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
}

export async function apiUpload(path: string, file: File) {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    body: form,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}