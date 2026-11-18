import type { User } from '@/types';

// MOCK AUTH: accounts and passwords live in this browser's localStorage in plain text.
// It demonstrates the flow only and is NOT secure. Replace with a real auth API before production.

const USERS_KEY = 'aurelia.mock.users';
const SESSION_KEY = 'aurelia.mock.session';
const LATENCY_MS = import.meta.env.MODE === 'test' ? 0 : 400;

interface StoredUser extends User {
  password: string;
}

export const DEMO_ACCOUNT = { email: 'admin@aurelia.example', password: 'Admin@123' } as const;

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Incorrect email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class EmailTakenError extends Error {
  constructor() {
    super('An account with this email already exists');
    this.name = 'EmailTakenError';
  }
}

const wait = () => new Promise<void>((resolve) => setTimeout(resolve, LATENCY_MS));

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as StoredUser[];
    } catch {
      // Corrupted storage falls through to reseeding.
    }
  }
  const seeded: StoredUser[] = [{ id: 'user-admin', name: 'Alex Morgan', ...DEMO_ACCOUNT }];
  localStorage.setItem(USERS_KEY, JSON.stringify(seeded));
  return seeded;
}

function toUser({ id, name, email }: StoredUser): User {
  return { id, name, email };
}

function saveSession(user: User) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export const authService = {
  getSession(): User | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<User> {
    await wait();
    const match = readUsers().find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!match) throw new InvalidCredentialsError();
    const user = toUser(match);
    saveSession(user);
    return user;
  },

  async register(name: string, email: string, password: string): Promise<User> {
    await wait();
    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) throw new EmailTakenError();
    const created: StoredUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      password,
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, created]));
    const user = toUser(created);
    saveSession(user);
    return user;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },
};
