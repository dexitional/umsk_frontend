import axios from './axios';
import { requestError } from './requestError';
const root = '/ais/sts';
export const stsRoles = ['sts::admin', 'sts::mentor', 'student::admin', 'student::registry'];
async function request(method: string, path: string, data?: any, params?: any) {
  try { return (await axios.request({ method, url: root + path, data, params })).data; }
  catch (error) { throw new Error(requestError(error, 'STS is unavailable. Please try again.')); }
}
export const stsService = {
  options: () => request('get', '/options'),
  assignments: (params: any) => request('get', '/assignments', undefined, params),
  students: (search: string) => request('get', '/students', undefined, { search }),
  mine: () => request('get', '/mine'),
  current: () => request('get', '/mine/current'),
  history: (id: string) => request('get', `/assignments/${encodeURIComponent(id)}/history`),
  save: (type: string, data: any, id?: string) => request(id ? 'patch' : 'post', `/${type}${id ? '/' + encodeURIComponent(id) : ''}`, data),
  remove: (type: string, id: string) => request('delete', `/${type}/${encodeURIComponent(id)}`),
  async report(params: any) {
    try {
      const { data } = await axios.get(root + '/report', { params, responseType: 'blob' });
      const url = URL.createObjectURL(data);
      const link = document.createElement('a'); link.href = url; link.download = 'STS-placements.csv';
      document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: any) {
      let message = requestError(error, 'Could not download the STS report.');
      if (error?.response?.data instanceof Blob) {
        try { message = JSON.parse(await error.response.data.text()).message || message; } catch { /* use fallback */ }
      }
      throw new Error(message);
    }
  },
};
