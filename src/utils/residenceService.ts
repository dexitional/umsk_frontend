import axios from './axios';
import { requestError } from './requestError';
export const hallRoles = ['hall::admin', 'student::admin', 'student::registry'];
async function request(method: string, path: string, data?: any, params?: any) {
  try { return (await axios.request({ method, url: '/ais/residence' + path, data, params })).data; }
  catch (error) { throw new Error(requestError(error, 'Hall records could not be loaded. Please try again.')); }
}
export const residenceService = {
  options: () => request('get', '/options'),
  students: (search: string) => request('get', '/students', undefined, { search }),
  assignments: (params: any) => request('get', '/assignments', undefined, params),
  occupancy: (academicYear: string) => request('get', '/occupancy', undefined, { academicYear }),
  mine: () => request('get', '/mine'),
  history: (studentId: string) => request('get', `/students/${encodeURIComponent(studentId)}/history`),
  original: (studentId: string, data: any) => request('post', `/students/${encodeURIComponent(studentId)}/original`, data),
  save: (type: string, data: any, id?: string) => request(id ? 'patch' : 'post', `/${type}${id ? '/' + encodeURIComponent(id) : ''}`, data),
  remove: (type: string, id: string) => request('delete', `/${type}/${encodeURIComponent(id)}`),
  release: (id: string, data: any) => request('post', `/assignments/${encodeURIComponent(id)}/release`, data),
  async report(params: any) {
    try {
      const { data } = await axios.get('/ais/residence/report', { params, responseType: 'blob' });
      const url = URL.createObjectURL(data); const link = document.createElement('a');
      link.href = url; link.download = 'hall-placements.csv'; document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
      let message = requestError(error, 'The hall report could not be downloaded.');
      if (error?.response?.data instanceof Blob) { try { message = JSON.parse(await error.response.data.text()).message || message; } catch { /* retain message */ } }
      throw new Error(message);
    }
  },
};
export const yearKey = (year: string) => year?.trim().replace(/\s*[-/]\s*/, '/') || '';
