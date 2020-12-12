import { fireEvent, render, screen, wait, queryByAttribute, waitFor } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { servicesVersion } from 'typescript';

const getById = queryByAttribute.bind(null, 'id');

test('login page should have verification title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Verification code/i);
  expect(linkElement).toBeInTheDocument();
});

test('submitting empty form should show error alert', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button'));
  
  const errorMessage = screen.getByText(/Verification code cannot be empty/);
  
  expect(errorMessage).toBeInTheDocument();
});

test('submitting form using six digits with ending number 7 should show error alert', async () => {
  const dom = render(<App />);

  const numbers = ['6','6','6','6','6','7'];

  for(let i=0;i<numbers.length;i++) {
    let input = getById(dom.container, 'input'+(i+1));
    await userEvent.click(input);
    userEvent.type(input, numbers[i]);
  }

  fireEvent.click(screen.getByRole('button'));
  
  await waitFor(() => expect(screen.getByText(/Verification error/)).toBeInTheDocument(), {
    timeout: 1000
  });

  //screen.debug();
});

test('submitting form using six digits with ending number 0 should show success alert', async () => {
  const dom = render(<App />);

  const originalError = console.error;
  console.error = jest.fn();

  const numbers = ['6','6','6','6','6','0'];

  for(let i=0;i<numbers.length;i++) {
    let input = getById(dom.container, 'input'+(i+1));
    await userEvent.click(input);
    userEvent.type(input, numbers[i]);
  }

  fireEvent.click(screen.getByRole('button'));
  
  await waitFor(() => expect(screen.getByText(/Verification success/)).toBeInTheDocument(), {
    timeout: 1000
  });

  //screen.debug();
  console.error = originalError;
});

test('successfull verification should redirect route to /success', async () => {
  const dom = render(<App />);

  const originalError = console.error;
  console.error = jest.fn();

  const numbers = ['6','6','6','6','6','0'];

  for(let i=0;i<numbers.length;i++) {
    let input = getById(dom.container, 'input'+(i+1));
    await userEvent.click(input);
    userEvent.type(input, numbers[i]);
  }

  fireEvent.click(screen.getByRole('button'));
  
  await waitFor(() => expect(screen.getByText(/You have entered the correct verification code/)).toBeInTheDocument(), {
    timeout: 3000
  });

  //screen.debug();

  console.error = originalError;
});



test('sending less than 6 characters should return error', async () => {
  
});