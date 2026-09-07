import axios from './axios';
import toast from 'react-hot-toast';
import { useUserStore } from './authService';
const { REACT_APP_API_URL } = import.meta.env;

// Every catch block below funnels through this: handles session expiry, then
// always re-throws so the failure actually surfaces (a toast in a try/catch
// caller, or the route's errorElement in a loader without one) instead of
// silently resolving as undefined, as if the request had succeeded.
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

class Service {

    /* Reports */
    async loadReport(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/report`, data)
            if(res.status == 200) return res.data
            else throw new Error(res.data?.message || "Unable to generate report.")

        } catch (error) {
            return checkSession(error)
        }
    }

    /* Sessions */
    async fetchSessionList(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/sessions/list`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
     }
     
    async fetchSessions(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/sessions?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchSession(sessionId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/sessions/${encodeURIComponent(sessionId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async postSession(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/sessions`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async updateSession(sessionId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/ams/sessions/${encodeURIComponent(sessionId)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteSession(sessionId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/ams/sessions/${encodeURIComponent(sessionId)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    /* Vouchers */
    async fetchVouchers(keyword,page){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/vouchers?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchVoucher(voucherId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/vouchers/${encodeURIComponent(voucherId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async postVoucher(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/vouchers`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async sellVoucher(voucherId,data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/vouchers/${encodeURIComponent(voucherId)}/sell`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               const dt = res.data;
               toast(`Voucher sold to ${data.applicantName}!\n\n\t\tSerial: ${dt.serial}\n\t\tPin: \t${dt.pin}`,{ duration: 10000, className:'border-2 border text-lg font-medium' })
               //toast.success("Voucher sold!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async recoverVoucher(voucherId){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/vouchers/${encodeURIComponent(voucherId)}/recover`, { serial: voucherId } ,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               const dt = res.data;
               toast(`Voucher sold to ${dt.applicantName}!\n\n\t\tSerial: ${dt.serial}\n\t\tPin: \t${dt.pin}`,{ duration: 10000, className:'border-2 border text-lg font-medium' })
                //toast.success("Voucher recovered!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async updateVoucher(voucherId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/ams/vouchers/${encodeURIComponent(voucherId)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteVoucher(voucherId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/ams/vouchers/${encodeURIComponent(voucherId)}`)
            if(res.status == 200){
               toast.success(`Voucher ${encodeURIComponent(voucherId)} was reset !`)
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    /* Letters */
    async fetchLetterList(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/letters/list`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
     }

    async fetchLetters(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/letters?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchLetter(letterId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/letters/${encodeURIComponent(letterId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async postLetter(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/letters`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async updateLetter(letterId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/ams/letters/${encodeURIComponent(letterId)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteLetter(letterId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/ams/vouchers/${encodeURIComponent(letterId)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

     /* Applicants */
     async fetchApplicants(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/applicants?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchApplicant(applicantId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/applicants/${encodeURIComponent(applicantId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async fetchApplicantPreview(applicantId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/applicants/${encodeURIComponent(applicantId)}/preview`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async fetchMyApplicant(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/applicants/me`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)

        } catch (error) {
           return checkSession(error)
        }
    }

    async fetchMyApplicantPreview(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/applicants/me/preview`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)

        } catch (error) {
           return checkSession(error)
        }
    }

    async postApplicant(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/applicants`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async updateApplicant(applicantId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/ams/applicants/${encodeURIComponent(applicantId)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async Applicant(applicantId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/ams/applicants/${encodeURIComponent(applicantId)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteApplicant(applicantId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/ams/applicants/${encodeURIComponent(applicantId)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    /* Shortlists */
    async fetchShortlists(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/shortlists?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchShortlist(shortlistId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/shortlists/${encodeURIComponent(shortlistId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)

        } catch (error) {
            return checkSession(error)
        }
    }

    async fetchMyShortlist(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/shortlists/me`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)

        } catch (error) {
            return checkSession(error)
        }
    }

    async postShortlist(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/shortlists`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Applicant shortlisted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Applicant already in shortlist");
            return checkSession(error);
        }
    }

    async updateShortlist(shortlistId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/ams/shortlists/${encodeURIComponent(shortlistId)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteShortlist(shortlistId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/ams/shortlists/${encodeURIComponent(shortlistId)}`)
            if(res.status == 200){
               toast.success("Applicant unlisted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    /* Matriculants */
    async fetchMatriculants(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/matriculants?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchMatriculant(matriculantId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/matriculants/${encodeURIComponent(matriculantId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async fetchMyMatriculant(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/matriculants/me`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)

        } catch (error) {
            return checkSession(error)
        }
    }

    async postMatriculant(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/matriculants`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Applicant admitted, Institutional email and credential generated !")
               return res.data
            }
            // Non-200 (204/403/409/500) all carry a real reason in res.data.message
            // (no bill configured, already admitted, no permission, etc) — surface
            // it as-is instead of collapsing every case to one guessed fallback.
            const notOk: any = new Error(res.data?.message || "Unable to process admission.");
            notOk.response = res;
            throw notOk;

        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Unable to process admission. Please check the details and try again.");
            return checkSession(error);
        }
    }

    async updateMatriculant(matriculantId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/ams/matriculants/${encodeURIComponent(matriculantId)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteMatriculant(matriculantId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/ams/matriculants/${encodeURIComponent(matriculantId)}`)
            if(res.status == 200){
               toast.success("Admission revoked!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    /* Helpers */
    async fetchStages(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/stages/list`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
     }

     async fetchApplytypes(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/applytypes/list`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
     }

     async fetchAmsPrices(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/prices/list`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
     }


     async fetchDashboard(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/dash`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
     }




    /* Application Step */

    // Applicant Configuration 
    async fetchStepApplicant(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/applicant/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepApplicant(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/applicant`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               //toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async getNextPageUrl(serial,tag = 'configure'){
        try {
            if(tag == 'configure') return { prevUrl: null, nextUrl: `/amsp/profile` }
            
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/applicant/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204){
               const data = res?.data;
               const currentStepMeta = data?.meta?.find(r => r?.tag == tag);
               const nextStepMeta = data?.meta?.find(r => r?.num == (Math.min(data?.meta?.length,currentStepMeta?.num+1)));
               const prevStepMeta = data?.meta?.find(r => r?.num == (Math.max(1,currentStepMeta?.num-1)));
               return { prevUrl: `/amsp/${prevStepMeta?.tag}`, nextUrl: `/amsp/${nextStepMeta?.tag}` }
            
            }  else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }
    

    // Profile
    async fetchStepProfile(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/profile/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepProfile(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/profile`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               //toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async saveProfile(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/profile`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               //toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    

    // Guardian
    async fetchStepGuardian(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/guardian/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepGuardian(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/guardian`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               //toast.success("Record saved!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    // Education
    async fetchStepEducation(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/education/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepEducation(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/education`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

     // Employment
     async fetchStepEmployment(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/employment/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepEmployment(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/employment`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    // Referee
    async fetchStepReferee(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/referee/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepReferee(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/referee`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    // Result
    async fetchStepResult(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/result/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepResult(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/result`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    // Choice
    async fetchStepChoice(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/choice/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepChoice(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/choice`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    // Documents
    async fetchStepDocument(serial){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/ams/step/document/${encodeURIComponent(serial)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async saveStepDocument(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/document`, data,{
               //headers: { "Content-Type" : "application/json" }
               headers: { "Content-Type" : "multipart/form-data" }
            })
            if(res.status == 200){
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    // Review & Completion
   
    async saveStepReview(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/ams/step/review`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Application Submitted Successfully!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    /* Admission helpers */
    async fetchInstituteCategories(){
      try {
        const res = await axios.get(`${REACT_APP_API_URL}/ams/institutes/list`)
        if(res.status == 200 || res.status == 204)
            return res.data
        else throw new(res.data.message)
    
      } catch (error) { 
        return checkSession(error)
      }
    }

    async fetchCertCategories(){
        try {
          const res = await axios.get(`${REACT_APP_API_URL}/ams/certificates/list`)
          if(res.status == 200 || res.status == 204)
              return res.data
          else throw new(res.data.message)
      
        } catch (error) { 
          return checkSession(error)
        }
    }

    async fetchDocumentCategories(){
        try {
          const res = await axios.get(`${REACT_APP_API_URL}/ams/documents/list`)
          if(res.status == 200 || res.status == 204)
              return res.data
          else throw new(res.data.message)
      
        } catch (error) { 
          return checkSession(error)
        }
    }

    async fetchGradeWeights(){
        try {
          const res = await axios.get(`${REACT_APP_API_URL}/ams/gradeweights/list`)
          if(res.status == 200 || res.status == 204)
              return res.data
          else throw new(res.data.message)
      
        } catch (error) { 
          return checkSession(error)
        }
    }

    async fetchAwardClasses(){
        try {
          const res = await axios.get(`${REACT_APP_API_URL}/ams/awardclasses/list`)
          if(res.status == 200 || res.status == 204)
              return res.data
          else throw new(res.data.message)
      
        } catch (error) { 
          return checkSession(error)
        }
    }

    async fetchSubjects(){
        try {
          const res = await axios.get(`${REACT_APP_API_URL}/ams/subjects/list`)
          if(res.status == 200 || res.status == 204)
              return res.data
          else throw new(res.data.message)

        } catch (error) {
          return checkSession(error)
        }
    }

    /* Blob -> File Migration Tool */
    async fetchBlobMigrationPreview(){
        try {
          const res = await axios.get(`${REACT_APP_API_URL}/ams/tools/blob-migration`)
          if(res.status == 200 || res.status == 204)
              return res.data
          else throw new(res.data.message)

        } catch (error) {
          return checkSession(error)
        }
    }

    async runBlobMigration(){
        try {
          const res = await axios.post(`${REACT_APP_API_URL}/ams/tools/blob-migration`)
          if(res.status == 200){
              return res.data
          }
          else throw new(res.data.message)

        } catch (error) {
          return checkSession(error)
        }
    }

}

export default new Service();