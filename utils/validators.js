const validateRegisterInput = (
  name,
  email,
  password,
  confirmPassword,
  country
) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errors = [];

  if (!name) {
    errors.push({ msg: 'Name is required' });
  }
  if (!country) {
    errors.push({ msg: 'Country is required' });
  }

  if (!email) {
    errors.push({ msg: 'Email is required' });
  } else if (!emailRegex.test(email)) {
    errors.push({ msg: 'Please provide a valid email' });
  }

  if (!password) {
    errors.push({ msg: 'Password is required' });
  } else if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: 'Passwords do not match' });
  }

  return errors;
};

const validateLoginInput = (email, name, password) => {
  const errors = [];
  if (!name) {
    errors.push({ msg: 'Name is required' });
  }

  if (!email) {
    errors.push({ msg: 'Email is required' });
  } else if (!emailRegex.test(email)) {
    errors.push({ msg: 'Please provide a valid email' });
  }

  if (!password) {
    errors.push({ msg: 'Password is required' });
  }

  return errors;
};

export { validateRegisterInput, validateLoginInput };
