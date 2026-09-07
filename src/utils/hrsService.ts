import axios from './axios';
import toast from 'react-hot-toast';
import { useUserStore } from './authService';
const { REACT_APP_API_URL } = import.meta.env;

// Every catch block below funnels through this: handles session expiry, then
// always re-throws so the failure actually surfaces (the toast above it here
// already fires with the message; this makes sure a loader/action calling in
// also sees the failure) instead of silently resolving as undefined.
// useUserStore.getState() is read lazily (inside the function) rather than
// at module scope, since this module can be pulled into the authService
// circular import chain before useUserStore finishes initializing.
const checkSession = (r: any) => {
   const status = r?.response?.status;
   if (!useUserStore.getState().isAuthenticated()) {
     useUserStore.getState().logout();
     window.location.href = '/';
   } else if (status == 401) {
     useUserStore.getState().logout();
     window.location.href = '/';
   }
   throw r;
}

class HrsService {
    
    ////**** NSS   ****////

    async fetchNSSAll(keyword,page){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/nss/all?keyword=${keyword}&page=${page}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async fetchNSS(id){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/nss/${encodeURIComponent(id)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async fetchNSSByPin(pin){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/nss/person/${encodeURIComponent(pin)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async postNSS(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/hrs/nss`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created successfully!")
               return res.data
            } 
            else return toast.error(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async postNSSRegister(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/hrs/nss/register`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created successfully!")
               return res.data
            } 
            else return toast.error(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async updateNSS(id,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/hrs/nss/${encodeURIComponent(id)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record updated successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async deleteNSS(nssId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/hrs/nss/${nssId}`)
            if(res.status == 200){
               toast.success("Record deleted successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

   
    /* NOTICES & CIRCULARS */

    async fetchNotices(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/notices`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async fetchNSSNotices(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/notices/nss`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async fetchNotice(noticeId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/notices/${noticeId}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async postNotice(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/hrs/notices`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async updateNotice(noticeId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/hrs/notices/${noticeId}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record updated successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async deleteNotice(noticeId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/hrs/notices/${noticeId}`)
            if(res.status == 200){
               toast.success("Record deleted successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }



    /* NSS SERVICE REQUESTS */

    async fetchServices(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/services`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async fetchService(serviceId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/services/${serviceId}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async postService(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/hrs/services`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async updateService(serviceId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/hrs/services/${serviceId}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record updated successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async deleteService(serviceId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/hrs/services/${serviceId}`)
            if(res.status == 200){
               toast.success("Record deleted successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }


    /* NSS Password Change  */
    async postNSSPassword(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/hrs/password/nss`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }


     /* SETTINGS */

     async fetchSettings(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/settings`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async fetchSetting(settingId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/settings/${settingId}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async postSetting(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/settings`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async updateSetting(settingId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/evs/settings/${settingId}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record updated successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }

    async deleteSetting(settingId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/evs/settings/${settingId}`)
            if(res.status == 200){
               toast.success("Record deleted successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }


    /* UNITS */

    async fetchUnits(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/hrs/units`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            toast.error(error?.response?.data?.message || error.message);
            return checkSession(error);
        }
    }


    
}

export default new HrsService();