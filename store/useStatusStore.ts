import { create } from "zustand";

type OrderStatus = "all" | "valid" | "pending";

interface StatusStore {
  status: OrderStatus;
  setStatus: (status: OrderStatus) => void;
}

export const useStatusStore = create<StatusStore>((set) => ({
  status: "all",
  setStatus: (status) => set({ status }),
}));
