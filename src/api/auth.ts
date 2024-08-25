export interface LoginResponse {
    success: boolean;
    message: string;
  }
  
  export const login = async (username: string, password: string): Promise<{ success: boolean; message: string }> => {
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
  
  export const register = async (username: string, password: string, name: string, email: string, age: number): Promise<LoginResponse> => {
    try {
      const response = await fetch('http://localhost:1337/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, email, age }),
      });
  
      if (response.ok) {
        return { success: true, message: 'Registration successful!' };
      } else {
        const errorText = await response.text();
        return { success: false, message: errorText || 'Registration failed.' };
      }
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, message: 'An error occurred during registration.' };
    }
  };