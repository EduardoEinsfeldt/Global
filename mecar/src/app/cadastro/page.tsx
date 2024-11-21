import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type RegisterFormInput = {
  username: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInput>();

  const onSubmit: SubmitHandler<RegisterFormInput> = async (data) => {
    if (data.password !== data.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Sending data to backend using fetch
      const response = await fetch('http://localhost:8080/MeCarJava/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password
        })
      });

      if (response.ok) {
        alert('Registration successful! You can now log in.');
      } else {
        const errorData = await response.json();
        alert('Registration failed: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An error occurred during registration. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">Username</label>
          <input
            id="username"
            type="text"
            className="w-full p-2 border rounded"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <span className="text-red-500">{errors.username.message}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border rounded"
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
          />
          {errors.password && <span className="text-red-500">{errors.password.message}</span>}
        </div>

        <div className="mb-4">
          <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="w-full p-2 border rounded"
            {...register('confirmPassword', { required: 'Please confirm your password' })}
          />
          {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;