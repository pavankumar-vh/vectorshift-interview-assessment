import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { ThemeProvider } from '../theme/ThemeContext';
import { LoginPage } from '../pages/LoginPage';

const renderLogin = () => {
  render(
    <MemoryRouter>
      <ThemeProvider>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
};

test('renders login form', () => {
  renderLogin();
  expect(
    screen.getByText(/enter your credentials to continue/i)
  ).toBeInTheDocument();
});
