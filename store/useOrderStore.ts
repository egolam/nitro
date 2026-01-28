import { create } from "zustand";

interface OrderStore {
  draftOrders: Record<string, number>;
  setDraftOrder: (productId: string, quantity: number) => void;
  removeDraftOrder: (productId: string) => void;
  getQuantity: (productId: string) => number | undefined;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  draftOrders: {},
  setDraftOrder: (productId, quantity) =>
    set((state) => ({
      draftOrders: { ...state.draftOrders, [productId]: quantity },
    })),
  removeDraftOrder: (productId) =>
    set((state) => {
      const newOrders = { ...state.draftOrders };
      delete newOrders[productId];
      return { draftOrders: newOrders };
    }),
  getQuantity: (productId) => get().draftOrders[productId],
}));
