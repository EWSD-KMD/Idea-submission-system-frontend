import { fetchRequest } from "./httpConfig";

export const get = <TResponse>(
  url: string,
  config?: RequestInit
): Promise<TResponse> => {
  return fetchRequest<TResponse>("GET", url, undefined, config);
};

export const post = <TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: RequestInit
): Promise<TResponse> => {
  return fetchRequest<TResponse, TRequest>("POST", url, data, config);
};

export const put = <TRequest, TResponse>(
  url: string,
  data: TRequest,
  config?: RequestInit
): Promise<TResponse> => {
  return fetchRequest<TResponse, TRequest>("PUT", url, data, config);
};

export const remove = <TResponse>(
  url: string,
  config?: RequestInit
): Promise<TResponse> => {
  return fetchRequest<TResponse>("DELETE", url, undefined, config);
};
