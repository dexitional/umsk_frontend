import axios from './axios';
import { setupCache } from 'axios-cache-interceptor';
import toast from 'react-hot-toast';
import { useUserStore } from './authService';
const { REACT_APP_API_URL } = import.meta.env;

// const instance = Axios.create();
// const axios = setupCache(instance)

// Every catch block below funnels through this: handles session expiry, then
// always re-throws so the failure actually surfaces (a toast in a try/catch
// caller, react-query's error state, or the route's errorElement) instead of
// silently resolving as undefined, as if the request had succeeded.
// useUserStore.getState() is read lazily (inside the function) rather than
// at module scope: authService.ts imports this module directly (for
// fetchVotes), so this module can execute before useUserStore's own
// `export const` finishes initializing, causing a TDZ ReferenceError if it's
// touched at module load time here.
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

class EvsService {
    
    async fetchElectionsAll(keyword,page){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections/search?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchElections(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchMyElections(tag){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections/my/${encodeURIComponent(tag)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchElection(electionId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async checkElectionAdmin(electionId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/admin-check`)
            if(res.status == 200)
              return res.data
            else throw new(res.data.message)

        } catch (error) {
            return checkSession(error)
        }
    }

    async sendElectionPins(electionId){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/pins`)
            if(res.status == 200){
              toast.success("Pins Sent!",{ className:'font-bold text-lg text-green-600'})
              return res.data
            }
            else throw new(res.data.message)

        } catch (error) {
            return checkSession(error)
            //console.error(error.message)
        }
    }

    async sendElectionReminder(electionId){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/reminder`)
            if(res.status == 200){
              toast.success("Reminder Sent!",{ className:'font-bold text-lg text-green-600'})
              return res.data
            }
            else throw new(res.data.message)

        } catch (error) {
            return checkSession(error)
            //console.error(error.message)
        }
    }

    async fetchVotes(electionId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/data`)
            if(res.status == 200 || res.status == 204){
                console.log(res.data);
              return res.data
            }
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async postVotes(electionId,data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/data`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            console.log(res)
            if(res.status == 200){
               toast.success("Voted successfully!",{ className:'font-bold text-lg text-green-600'})
               return res.data
            }
            else if(res.status == 203 && res?.data?.message.toLowerCase() == 'elector already voted'){
               toast.error(res.data.message,{ className:'font-bold text-lg text-red-500'})
               return res?.data;
            }
            else return toast.error(res.data.message,{ className:'font-bold text-lg text-red-500'})
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchPortfolios(electionId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/portfolios`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchVoters(electionId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/voters`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchVoter(electionId,tag){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/voters/${encodeURIComponent(tag)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async postVoter(electionId,data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/voters`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created!")
               return res.data
            } 
            else return toast.error(res?.data?.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteVoter(electionId,tag){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/voters/${tag}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    async fetchReceipt(electionId,tag){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}/receipt/${encodeURIComponent(tag)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async postElection(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/elections`, data,{
               headers: { "Content-Type" : "multipart/form-data" }
            })
            if(res.status == 200){
               toast.success("Record created!")
               return res.data
            } 
            else return toast.error(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async updateElection(electionId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}`, data, {
               headers: { "Content-Type" : "multipart/form-data" }
            })
            if(res.status == 200){
               toast.success("System updated!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteElection(electionId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/evs/elections/${encodeURIComponent(electionId)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    /* ACTIONS */
    async resetElection(electionId){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/action/reset`, { electionId },{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Election Reset Success!")
               return res.data
            } 
            else return toast.error(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async updateAdmin(electionId,tag){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/action/admin`,{ electionId,tag },{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Admin users updated!")
               return res.data
            } 
            else return toast.error(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    async stageVoters(electionId){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/action/voters`, { electionId },{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created!")
               return res.data
            } 
            else return toast.error(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

   
    /* PORTFOLIOS */

    async fetchRoles(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/roles`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchPortfolioList(electionId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/portfolios/list?electionId=${encodeURIComponent(electionId)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchPortfolio(portfolioId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/portfolios/${encodeURIComponent(portfolioId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }


    async postPortfolio(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/portfolios`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record created!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async updatePortfolio(portfolioId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/evs/portfolios/${encodeURIComponent(portfolioId)}`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Record updated!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deletePortfolio(portfolioId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/evs/portfolios/${encodeURIComponent(portfolioId)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


     /* CANDIDATES */

     async fetchCandidates(portfolioId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/portfolios/${encodeURIComponent(portfolioId)}/candidates`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async fetchCandidate(candidateId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/evs/candidates/${encodeURIComponent(candidateId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }


    async postCandidate(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/evs/candidates`, data,{
                headers: { "Content-Type" : "multipart/form-data" }
            })
            if(res.status == 200){
               toast.success("Record created!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async updateCandidate(candidateId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/evs/candidates/${encodeURIComponent(candidateId)}`, data,{
               headers: { "Content-Type" : "multipart/form-data" }
            })
            if(res.status == 200){
               toast.success("Record updated!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async deleteCandidate(candidateId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/evs/candidates/${encodeURIComponent(candidateId)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    
}

export default new EvsService();