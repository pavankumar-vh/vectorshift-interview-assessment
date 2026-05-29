import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../auth/AuthContext';
import { LoginPage } from '../pages/LoginPage';

const renderLogin = () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
};

test('renders login form', () => {
  renderLogin();
  expect(
    screen.getByText(/sign in to your pipeline workspace/i)
  ).toBeInTheDocument();
});
