import create from 'zustand';

const useFolderStore = create((set) => ({
  folders: [],
  sharedFolders: [],
  setFolders: (folders) => set({ folders }),
  setSharedFolders: (sharedFolders) => set({ sharedFolders }),
}));
