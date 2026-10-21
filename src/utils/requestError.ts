export function requestError(error: any, fallback = 'The request could not be completed. Please try again.'): string {
  const message = error?.response?.data?.message || error?.message;
  return typeof message === 'string' && message.trim() ? message : fallback;
}
