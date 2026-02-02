import { createSlice } from "@reduxjs/toolkit";

function keyForEmail(email) {
  return `clothify:wishlist:${(email || "").toLowerCase()}`;
}

function loadWishlist(email) {
  try {
    const raw = localStorage.getItem(keyForEmail(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWishlist(email, items) {
  try {
    localStorage.setItem(keyForEmail(email), JSON.stringify(items || []));
  } catch {
    // ignore storage errors
  }
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    ownerEmail: null,
  },
  reducers: {
    hydrateWishlist(state, action) {
      const email = action.payload?.email || null;
      state.ownerEmail = email;
      state.items = email ? loadWishlist(email) : [];
    },
    addToWishlist(state, action) {
      const product = action.payload;
      if (!state.ownerEmail) return;
      if (!product?._id) return;

      const exists = state.items.some((p) => p._id === product._id);
      if (!exists) state.items.unshift(product);
      saveWishlist(state.ownerEmail, state.items);
    },
    removeFromWishlist(state, action) {
      if (!state.ownerEmail) return;
      const id = action.payload;
      state.items = state.items.filter((p) => p._id !== id);
      saveWishlist(state.ownerEmail, state.items);
    },
    clearWishlist(state) {
      state.items = [];
      state.ownerEmail = null;
    },
  },
});

export const { hydrateWishlist, addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;

