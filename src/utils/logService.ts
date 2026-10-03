import axios from './axios';
import { useUserStore } from './authService';

const { REACT_APP_API_URL } = import.meta.env;

// Log Module API (backend route/logRoute.ts, audit::admin only). The token is
// read per request so it's always the current session's.
const headers = () => ({ "Content-Type": "application/json", "x-access-token": useUserStore.getState().token });

export type LogQuery = { keyword?: string; category?: string; action?: string; user?: string; student?: string; from?: string; to?: string; page?: number | string; pageSize?: number | string };

const LogService = {
  async fetchLogs(q: LogQuery) {
    const params = new URLSearchParams(Object.entries(q).filter(([, v]) => v !== undefined && v !== '' && v !== null).map(([k, v]) => [k, String(v)]));
    const res = await axios.get(`${REACT_APP_API_URL}/logs?${params.toString()}`, { headers: headers() });
    return res.data;
  },
  async fetchSummary() {
    const res = await axios.get(`${REACT_APP_API_URL}/logs/summary`, { headers: headers() });
    return res.data;
  },
  async fetchLog(id: string) {
    const res = await axios.get(`${REACT_APP_API_URL}/logs/${encodeURIComponent(id)}`, { headers: headers() });
    return res.data;
  },
};

export default LogService;
