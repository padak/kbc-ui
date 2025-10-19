export const STACK_URLS = [
  { label: "US (connection.keboola.com)", value: "https://connection.keboola.com" },
  { label: "EU Central (eu-central-1)", value: "https://connection.eu-central-1.keboola.com" },
  { label: "Azure EU (north-europe)", value: "https://connection.north-europe.azure.keboola.com" },
];

export interface AuthCredentials {
  stackUrl: string;
  token: string;
}

export async function validateToken(stackUrl: string, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${stackUrl}/v2/storage`, {
      headers: {
        'X-StorageApi-Token': token,
        'Content-Type': 'application/json',
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
}

export function saveAuth(credentials: AuthCredentials): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('kbc_token', credentials.token);
    localStorage.setItem('kbc_stack_url', credentials.stackUrl);
  }
}

export function getAuth(): AuthCredentials | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('kbc_token');
  const stackUrl = localStorage.getItem('kbc_stack_url');
  
  if (!token || !stackUrl) return null;
  
  return { token, stackUrl };
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kbc_token');
    localStorage.removeItem('kbc_stack_url');
  }
}
