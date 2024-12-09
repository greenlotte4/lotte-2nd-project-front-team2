import { create } from 'zustand';

const useStorageStore = create((set) => ({
    storageInfo: {
        maxSize: 0,
        currentUsedSize: 0,
        currentRemainingSize: 0,
    },
    setStorageInfo: (newStorageInfo) =>
        set({ storageInfo: newStorageInfo }),
}));

export default useStorageStore;
