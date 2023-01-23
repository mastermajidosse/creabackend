const validateRegisterInput = (username,
    password,
    confirmPassword) => {
        const errors = {};
        if (username.trim() === '') {
          errors.username = 'Username must not be empty';
        }
  
        if (password === '') {
          errors.password = 'Password must not empty';
        } else if (password !== confirmPassword) {
          errors.confirmPassword = 'Passwords must match';
        }
      
        return {
          errors,
          valid: Object.keys(errors).length < 1
        };
}


const validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === '') {
      errors.username = 'Username must not be empty';
    }
    if (password.trim() === '') {
      errors.password = 'Password must not be empty';
    }
  
    return {
      errors,
      valid: Object.keys(errors).length < 1
    };
  };


  export {
    validateRegisterInput,
    validateLoginInput
  }