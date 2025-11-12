import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {  Lock, Mail, ArrowRight,Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/UI/Alert';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

// Mocked Types
type LoginCredentials = {
  email: string;
  password: string;
};

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login({...data, role:'admin'});
      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (error: any) {
      console.error('Admin login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
      
      {/* --- Branding Panel (Left Side) - Admin Theme --- */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-purple-600 to-violet-700 text-white">
        {/* Logo */}
        <div className="flex items-center space-x-3 z-10">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
          <Package className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Brand Boosters</h1>
        </div>
        
        {/* Welcome Message */}
        <div className="z-10 max-w-lg">
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Admin Control Panel
          </h2>
          <p className="text-lg text-violet-100 font-light">
            Access the administrative dashboard to manage operations.
          </p>
        </div>


        {/* Footer Text */}
        <div className="z-10 text-sm text-violet-200">
          &copy; {new Date().getFullYear()} Brand Boosters. All rights reserved.
        </div>

        {/* Abstract background shapes - Admin Theme */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
       
          {/* Circular shapes */}
          <svg className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] text-purple-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100c55.23 0 100-44.77 100-100S155.23 0 100 0z" clipRule="evenodd"/>
          </svg>
          <svg className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] text-violet-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M170.7 50c9.4 12.5 14.3 28.3 14.3 45 0 16.7-4.9 32.5-14.3 45s-23.3 20-38.2 20c-14.9 0-28.8-7.5-38.2-20s-14.3-28.3-14.3-45 4.9-32.5 14.3-45 23.3-20 38.2-20c14.9 0 28.8 7.5 38.2 20z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>

      {/* --- Form Panel (Right Side) --- */}
      <div className="flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo (visible on small screens) */}
          <div className="flex items-center space-x-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Brand Boosters Admin</h1>
          </div>

          {/* Form Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-gray-600">
              Administrative access only.{' '}
              <Link to="/" className="font-semibold text-purple-600 hover:text-purple-700">
                Return to main site
              </Link>
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert type="error" message={error} />}
            
            <Input
              label="Admin Email"
              type="email"
              icon={<Mail className="h-5 w-5" />}
              placeholder="admin@brandboosters.com"
              required
              {...register('email', {
                required: 'Email is required',
                pattern: { value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
              })}
              error={errors.email?.message}
            />

            <Input
              label="Admin Password"
              type={'password'}
              icon={<Lock className="h-5 w-5" />}
              placeholder="••••••••"
              required
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full py-3 font-semibold text-base flex items-center justify-center group"
              style={{ backgroundColor: '#7C3AED', color: 'white' }} // Purple-600
              isLoading={isLoading}
            >
              {isLoading ? 'Accessing Admin Panel...' : (
                <>
                  Access Admin Panel
                  <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;