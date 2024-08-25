export interface LoginResponse {
    success: boolean;
    message: string;
  }
  
  export const login = async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('http://localhost:1337/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',  
      });
  
      if (response.ok) {
        return { success: true, message: 'Login successful!' };
      } else {
        const errorText = await response.text();
        return { success: false, message: errorText || 'Login failed.' };
      }
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, message: 'An error occurred during login.' };
    }
  };
  