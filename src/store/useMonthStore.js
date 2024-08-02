import { create } from 'zustand';

const useMonthStore = create((set) => ({
  monthData: [],
  setMonthData: (data) => set(() => ({ monthData: data })),
}));

export default useMonthStore;
