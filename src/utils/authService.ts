import axios from "axios";
import { JwtPayload, jwtDecode } from "jwt-decode";
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Service from '../utils/evsService';
import { StoreState } from "./typings";

const { REACT_APP_API_URL } = import.meta.env;

export const useUserStore = create<StoreState>()(
  persist(
    (set, get) => ({
        user: null,
        token: null,
        tag: null,
        message: null, 
        loading: false,
        loginform: '',
        isAuthenticated : () => !!get()?.user,
        lasChosen: null,
        search: '',
        limit: {},
        courses: [],
        stepUrl: {},
        electionData: null,
        loadUserData: async() => {
          const storageToken = localStorage.getItem("@Auth:token")
          if (storageToken) {
            const userData = await jwtDecode<JwtPayload>(storageToken)
            set({ user: userData })
          } else {
            set({ user: get().user })
          }
        },

        loadStudentVote: async() => {  
           const user =  get().user;
           const data = await Service.fetchVotes(user?.user?.tag);
           if(data?.length) set({ lasChosen: data && data[0] })
           else set({ lasChosen: null })
        },

        lasChoose: async (data) => {  
          set({ lasChosen: data })
        },

        setSearch: async (data) => {  
          set({ search: data })
        },
        setLoginform: async (msg) => {  
          set({ loginform: msg })
        },
        setLimit: async (data) => {  
          set({ ...data })
        },

        logout: () => {
          localStorage.removeItem("@Auth:token");
          set({ user:null, lasChosen: null })
        },

        withCredential : async (username, password) => {
            try {
              set({ message:null, loading: true })
              const res = await axios.post(`${REACT_APP_API_URL}/auth/credential`, {
                username: username,
                password: password,
              });
              const resp = res.data
              if(resp.success){
                const token = await resp?.token;
                 localStorage.setItem("@Auth:token", token);
                set({ user:resp.data, token, loading: false, tag: null })
              } else {
                set({ message:resp.message, loading: false })
                setTimeout( async() => set({ message:null }), 3000)
              }
              
            } catch (err) {
              set({ message:err.message, loading: false })
              setTimeout( async() => set({ message:null }), 3000)
            }
        },

        
        withGoogle : async (providerId,email) => {
          try {
            set({ message:null, loading: true })
            const res = await axios.post(`${REACT_APP_API_URL}/auth/google`, {
              providerId,
              email,
            });
            
            const resp = res.data
            if(resp.success){
              const token = await resp?.token;
              localStorage.setItem("@Auth:token", token);
              set({ user:resp.data, token, loading: false, tag: null,message:null })
              
            } else {
              set({ message:resp.message, loading: false })
              setTimeout(() => set({ message:null }), 4000)
              toast.error("wrong credentials")
            }
            
          } catch (err) {
            set({ message:err.message, loading: false })
            setTimeout(() => set({ message:null }), 4000)
            toast.error(err)
          }
        },

        forgetPassword : async (tag, phone) => {
          try {
            set({ message:null, loading: true })
            const res = await axios.post(`${REACT_APP_API_URL}/auth/forget`, { tag,phone });
            const resp = res.data;
            if(resp.success){
              toast.success("Password Reset Successful!")
              set({ user: null, loading: false, tag: null })
            } else {
              toast.error(resp.message ? resp.message : "Password Reset Attempt Failed!")
              set({ loading: false, tag: null })
             
            }
            
          } catch (err) {
            toast.success(err)
            set({ loading: false, tag: null })
            
          }
        },

        switchUser : async (tag) => {
            try {
              // This file uses the raw axios package (not utils/axios.ts's
              // configured instance, which auto-attaches this header via an
              // interceptor) — every other call here is pre-login and
              // legitimately needs no token, but switchUser is only ever
              // called from an already-authenticated session, and the
              // backend now requires it (see authRoute.ts's /switch guard).
              const currentToken = localStorage.getItem("@Auth:token");
              const res = await axios.post(`${REACT_APP_API_URL}/auth/switch`, { tag }, {
                headers: { "x-access-token": currentToken }
              });
              const resp = res.data
              if(resp.success){
                const token = await resp?.token;
                const user = get().user;
                localStorage.setItem("@Auth:token", token);
                if(user?.user?.group_id == 2)
                  set({ user:resp.data, token, tag: user?.user?.tag })
                else 
                  set({ user:resp.data, token,tag: null })
              } else {
                set({ message:resp.message, tag: null })
                setTimeout( async() => set({ message:null }), 1000)
              }
            } catch (err) {
              set({ message:err.message, loading: false })
              setTimeout( async() => set({ message:null }), 1000)
            }
        },
        
        changePassword : async (tag, oldpassword, newpassword) => {
          try {
            set({ message:null, loading: true })
            const res = await axios.post(`${REACT_APP_API_URL}/auth/password`, {
               tag,oldpassword,newpassword
            });
            if(res.status == 200){
              get()?.logout()
              set({ user:null, token: null, courses: [], loading: false })
              toast.success("Password changed!")
            } else if(res.status == 202)
              throw new(res.data.message)
              
          } catch (err) {
            set({ message:err.message, loading: false })
            toast.error(err.message)
          }
      },

      }),
    {
      name: '@Auth', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    },
  ),
)




