declare global {
  interface Window {
    env?: {
      apiUrl: string;
      production: boolean;
    };
  }
}

export const environment = {
  production: window.env?.production ?? true,
  apiUrl: window.env?.apiUrl ?? '/api',
};
