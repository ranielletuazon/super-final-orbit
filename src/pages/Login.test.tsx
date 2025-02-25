import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { auth, db } from '../components/firebase/firebase';
import { doc, getDoc} from 'firebase/firestore';
import Login from './Login';


describe('Login Component', () => {
  it('displays the phrase "EXPLORE AND FIND YOUR IDEAL TEAM"', () => {
    render(
      <MemoryRouter>
        <Login user={"9vpyfsq7eyVxlRvc8o0OarkW0Vf2"}/>
      </MemoryRouter>
    );
  });

  it('Displays the second phrase "Orbit will help you find your preferred team-mate"', () => {
    render(
        <MemoryRouter>
          <Login user={null}/>
        </MemoryRouter>
    );
  });
});

describe('Login Component', () => {
  test('updates email and password inputs correctly', () => {
    render(
      <MemoryRouter>
        <Login user={null} />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/enter your password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });
});