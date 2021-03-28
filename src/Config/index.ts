export const apiUrl = process.env.REACT_APP_API_URL || '';
if (!apiUrl) {
  throw new Error('Environment variable "REACT_APP_API_URL" was not set. Can not determine API url');
}
