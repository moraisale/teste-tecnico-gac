const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_URLS = {
  main: `${BASE_URL}`,
};

function path(base: string, url: string) {
  return new URL(url, base).href;
}

export const MAIN_SERVICE_ROUTES = {
  register: path(API_URLS.main, "/api/auth/register"),
};