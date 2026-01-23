const LS_ADMIN_KEY = "clothify:admin";

export function loadAdmin() {
  try {
    const raw = localStorage.getItem(LS_ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveAdmin(admin) {
  try {
    if (!admin) localStorage.removeItem(LS_ADMIN_KEY);
    else localStorage.setItem(LS_ADMIN_KEY, JSON.stringify(admin));
  } catch {
  }
}

