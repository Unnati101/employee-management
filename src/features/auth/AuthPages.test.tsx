import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { LoginPage } from '@/features/auth/LoginPage';
import { RegisterPage } from '@/features/auth/RegisterPage';

function renderAuth(initialPath: string) {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<p>Signed-in home</p>} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
  return userEvent.setup();
}

describe('authentication pages', () => {
  it('validates the login form', async () => {
    const user = renderAuth('/login');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('rejects wrong credentials', async () => {
    const user = renderAuth('/login');
    await user.type(screen.getByLabelText('Email'), 'admin@aurelia.example');
    await user.type(screen.getByLabelText('Password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Incorrect email or password')).toBeInTheDocument();
  });

  it('signs in with the demo account', async () => {
    const user = renderAuth('/login');
    await user.click(screen.getByRole('button', { name: 'Fill demo account' }));
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Signed-in home')).toBeInTheDocument();
  });

  it('requires matching passwords on registration', async () => {
    const user = renderAuth('/register');
    await user.type(screen.getByLabelText('Password'), 'Passw0rd!');
    await user.type(screen.getByLabelText('Confirm password'), 'Different1');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText('Passwords do not match')).toBeInTheDocument();
  });

  it('registers a new account and signs in', async () => {
    const user = renderAuth('/register');
    await user.type(screen.getByLabelText('Full name'), 'Jane Doe');
    await user.type(screen.getByLabelText('Work email'), 'jane@aurelia.example');
    await user.type(screen.getByLabelText('Password'), 'Passw0rd!');
    await user.type(screen.getByLabelText('Confirm password'), 'Passw0rd!');
    await user.click(screen.getByRole('button', { name: 'Create account' }));
    expect(await screen.findByText('Signed-in home')).toBeInTheDocument();
  });
});
