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

class FmsService {
   
//     /* Session */
//     this.router.get('/bills', this.controller.fetchBills);
//     this.router.get('/bills/list', this.controller.fetchBillList);
//     this.router.get('/bills/:id', this.controller.fetchBill);
//     this.router.get('/bills/:id/receipients', this.controller.billReceivers);
//     this.router.post('/bills/:id/include', this.controller.includeBill);
//     this.router.post('/bills/:id/exclude', this.controller.excludeBill);
//     this.router.get('/bills/:id/activate', this.controller.activateBill);
//     this.router.get('/bills/:id/revoke', this.controller.revokeBill);
//     this.router.post('/bills', this.controller.postBill);
//     this.router.patch('/bills/:id', this.controller.updateBill);
//     this.router.delete('/bills/:id', this.controller.deleteBill);


     /* Dashboard Statistics */
   async loadDashboard(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/dash`)
            if(res.status == 200 || res.status == 204)
            return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    /* Reports */
    async loadReport(data){
        try {
        const res = await axios.post(`${REACT_APP_API_URL}/fms/report`, data)
        if(res.status == 200) return res.data
        else throw new(res.data.message)
        
        } catch (error) { 
        return checkSession(error)
        }
    }

    
    /* Accounts & Debtors */
    async fetchAccounts(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/accounts?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchAccount(accountId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/accounts/${encodeURIComponent(accountId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async fetchDebts(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/accounts/debts?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async retireAccount(tag){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/accounts/retire/${encodeURIComponent(tag)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

   

     /* Charges */

    async fetchCharges(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/charges?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchCharge(chargeId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/charges/${encodeURIComponent(chargeId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async lateCharge(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/charges/late`, data,{
               headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
               toast.success("Late Registration Fine charged!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async postCharge(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/charges`, data,{
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

    async updateCharge(chargeId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/fms/charges/${encodeURIComponent(chargeId)}`, data,{
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

    async deleteCharge(chargeId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/fms/charges/${encodeURIComponent(chargeId)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    /* Payments */

    async fetchPayments(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/payments?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchPaymentOthers(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/payments/other?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchPaymentVouchers(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/payments/voucher?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchPayment(paymentId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/payments/${encodeURIComponent(paymentId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async convertPayment(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/payments/convert`, data,{
                headers: { "Content-Type" : "application/json" }
             })
             if(res.status == 200){
                toast.success("Payment Converted !")
                return res.data
             } 
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async postPayment(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/payments`, data,{
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

    async updatePayment(paymentId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/fms/payments/${encodeURIComponent(paymentId)}`, data,{
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

    async deletePayment(paymentId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/fms/payments/${encodeURIComponent(paymentId)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    /* Services */

    async fetchServiceList(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/services/list`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchServices(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/services?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchService(serviceId){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/services/${encodeURIComponent(serviceId)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async postService(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/services`, data,{
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

    async updateService(serviceId,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/fms/services/${encodeURIComponent(serviceId)}`, data,{
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

    async deleteService(serviceId){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/fms/services/${encodeURIComponent(serviceId)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    /* Voucher Costs */

    async fetchVcosts(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/vsales?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchVcost(id){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/vsales/${encodeURIComponent(id)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async postVcost(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/vsales`, data,{
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

    async updateVcost(id,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/fms/vsales/${encodeURIComponent(id)}`, data,{
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

    async deleteVcost(id){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/fms/vsales/${encodeURIComponent(id)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


    /* Bills  */

    async fetchBills(keyword,page,limit){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/bills?keyword=${encodeURIComponent(keyword)}&page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(limit)}`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async fetchBillList(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/bills/list`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async billReceivers(id){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}/receipients`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async fetchBillActivity(id){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}/activity`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    async includeBill(id,data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}/include`, data,{
                headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
                toast.success(`Student added to Bill Inclusion List !`)
                return res.data
             } else if(res.status == 204){
                return res.data
             } else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async excludeBill(id,data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}/exclude`, data,{
                headers: { "Content-Type" : "application/json" }
            })
            if(res.status == 200){
                toast.success(`Student added to Bill Exclusion List !`)
                return res.data
             } else if(res.status == 204){
                return res.data
             } else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async activateBill(id){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}/activate`)
            if(res.status == 200){
                toast.success(`Bill Published !`)
                return res.data;
             } else if(res.status == 204){
                return res.data;
             } else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async revokeBill(id){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}/revoke`)
            if(res.status == 200){
               toast.success(`Bill Revoked !`)
               return res.data
            } else if(res.status == 204){
               return res.data
            } else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async fetchBill(id){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}`)
            if(res.status == 200 || res.status == 204)
               return res.data
            else throw new(res.data.message)
        
        } catch (error) {
            return checkSession(error)
        }
    }

    async postBill(data){
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/fms/bills`, data,{
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

    async updateBill(id,data){
        try {
            const res = await axios.patch(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}`, data,{
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

    async deleteBill(id){
        try {
            const res = await axios.delete(`${REACT_APP_API_URL}/fms/bills/${encodeURIComponent(id)}`)
            if(res.status == 200){
               toast.success("Record deleted!")
               return res.data
            } 
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }


     /* Helpers */

    //  Fetch Bank Accounts
     async fetchBankaccList(){
        try {
            const res = await axios.get(`${REACT_APP_API_URL}/fms/bankaccs/list`)
            if(res.status == 200 || res.status == 204)
              return res.data
            else throw new(res.data.message)
        
        } catch (error) { 
            return checkSession(error)
        }
    }

    
}

export default new FmsService();