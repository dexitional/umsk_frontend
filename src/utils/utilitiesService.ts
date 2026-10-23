import axios from './axios';
import { requestError } from './requestError';
export const utilityRoles = ['utilities::admin', 'student::admin', 'student::registry'];
export const utilityModules = [
  ['religion', 'Religion'], ['region', 'Region'], ['change-of-program', 'Change of program'],
  ['disability', 'Disability'], ['title', 'Title'], ['country', 'Country'], ['marital', 'Marital status'], ['relation', 'Relation'],
];
async function request(method: string, path: string, data?: any, params?: any) {
  try { return (await axios.request({ method, url: '/ais/utilities' + path, data, params })).data; }
  catch (error) { throw new Error(requestError(error, 'Utilities could not be loaded. Please try again.')); }
}
export const utilitiesService = {
  options: () => request('get', '/options'),
  students: (search: string) => request('get', '/students', undefined, { search }),
  list: (module: string, params: any) => request('get', '/' + module, undefined, params),
  save: (module: string, data: any, id?: string) => request(id ? 'patch' : 'post', `/${module}${id ? '/' + encodeURIComponent(id) : ''}`, data),
  remove: (module: string, record: any) => request('delete', `/${module}/${encodeURIComponent(record.id)}`, { updatedAt: record.updatedAt }),
  approve: (record: any, majorId: string) => request('post', `/change-of-program/${encodeURIComponent(record.id)}/approve`, { updatedAt: record.updatedAt, studentSnapshot: record.student && { programId: record.student.programId, majorId: record.student.majorId, semesterNum: record.student.semesterNum, indexno: record.student.indexno }, majorId }),
};
