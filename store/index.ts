import { create } from 'zustand'
import { userState } from '@/types/auth/user';



const useUserStore = create<userState>((set) => ({
  accountData: null,
  bearerToken: null,
  fileNodes: null,
  setAccountData: (accountData) => set(() => ({ accountData })),
  setBearerToken: (bearerToken) => set(() => ({ bearerToken })),
  setFileNodes: (fileNodes) => set(() => ({ fileNodes })),
}))

export default useUserStore;
