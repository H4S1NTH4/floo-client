import { User, UserRole } from '@/components/providers/auth-provider';

// Mock user database
const users: User[] = [
  {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    role: 'customer',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '2',
    name: 'Sara Restaurant',
    email: 'restaurant@example.com',
    role: 'restaurant',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '3',
    name: 'Dave Driver',
    email: 'driver@example.com',
    role: 'driver',
    profileImage: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  async getCurrentUser(): Promise<User> {
    // Check localStorage for user info
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
      return JSON.parse(savedUser);
    }
    
    throw new Error('No user is currently logged in');
  }

  async login(email: string, password: string): Promise<User> {
    await delay(800); // Simulate API call delay
    
    // Find user with matching email (password check would happen server-side in a real app)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Save to localStorage to persist "session"
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }

  async signup(name: string, email: string, password: string, role: UserRole): Promise<User> {
    await delay(1000); // Simulate API call delay
    
    // Check if email is already in use
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already in use');
    }
    
    // Create new user
    const newUser: User = {
      id: `${users.length + 1}`,
      name,
      email,
      role,
      // Default profile image
      profileImage: 'https://images.pexels.com/photos/1699159/pexels-photo-1699159.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    };
    
    // In a real app, we would send this to the server and save it in the database
    // For now, we'll just add it to our in-memory "database"
    users.push(newUser);
    
    // Save to localStorage to persist "session"
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return newUser;
  }

  async logout(): Promise<void> {
    await delay(300); // Simulate API call delay
    
    // Clear user from localStorage
    localStorage.removeItem('currentUser');
  }

  async loginWithGoogle(): Promise<User> {
    await delay(1000); // Simulate API call delay and OAuth flow
    
    // For the mock, we'll just return the first user from our "database"
    const user = users[0];
    
    // Save to localStorage to persist "session"
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }

  async loginWithFacebook(): Promise<User> {
    await delay(1000); // Simulate API call delay and OAuth flow
    
    // For the mock, we'll just return the first user from our "database"
    const user = users[0];
    
    // Save to localStorage to persist "session"
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  }
}

export const authService = new AuthService();