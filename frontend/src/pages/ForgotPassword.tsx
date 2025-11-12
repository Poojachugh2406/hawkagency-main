import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Package, Mail, ArrowLeft,  ArrowRight } from 'lucide-react';
import { authAPI } from '@/utils/api';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import Alert from '@/components/UI/Alert';
import { useForm } from 'react-hook-form';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    // e.preventDefault();

    if (!data.email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.forgotPassword({ email: data.email });
      if (response.success) {
        // setSuccess(true);
        navigate('/reset-password', { state: { email: data.email } });
        toast.success('Password reset OTP sent to your email!');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to send password reset email');
      toast.error(error.response?.data?.message || error.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // const email = watch("email");
  // const handleNavigateToReset = () => {
  //   navigate('/reset-password', { state: { email } });
  // };

  // Branding Panel Component (same as register/login)
  const BrandingPanel: React.FC = () => (
    <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-sky-500 to-indigo-600 text-white">
      <div className="flex items-center space-x-3 z-10">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
          <Package className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Brand Boosters</h1>
      </div>

      <div className="z-10 max-w-lg">
        <h2 className="text-5xl font-bold leading-tight mb-4">
          Reset Your Password
        </h2>
        <p className="text-lg text-indigo-100 font-light">
          Enter your email address and we'll send you a code to reset your password and get you back on track.
        </p>
      </div>

      <div className="z-10 text-sm text-indigo-200">
        &copy; {new Date().getFullYear()} Brand Boosters. All rights reserved.
      </div>

      <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
        <svg className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] text-sky-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100c55.23 0 100-44.77 100-100S155.23 0 100 0z" clipRule="evenodd" />
        </svg>
        <svg className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] text-indigo-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M170.7 50c9.4 12.5 14.3 28.3 14.3 45 0 16.7-4.9 32.5-14.3 45s-23.3 20-38.2 20c-14.9 0-28.8-7.5-38.2-20s-14.3-28.3-14.3-45 4.9-32.5 14.3-45 23.3-20 38.2-20c14.9 0 28.8 7.5 38.2 20z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );

  // Mobile Header Component
  const MobileHeader: React.FC = () => (
    <div className="flex items-center space-x-3 mb-8 lg:hidden">
      <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
        <Package className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">Brand Boosters</h1>
    </div>
  );



  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Branding Panel (Left Side) */}
      <BrandingPanel />
      {/* Form Panel (Right Side) */}
      <div className="flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <MobileHeader />
          {(
              <>
                <h2 className="text-3xl font-bold text-gray-900">
                  Forgot Password?
                </h2>
                <p className="mt-2 text-gray-600">
                  Don't worry! Enter your email and we'll send you a reset code.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                  {error && <Alert type="error" message={error} />}


                  <Input
                    label="Email Address"
                    type="email"
                    icon={<Mail className="w-4 h-4" />}
                    placeholder="your.email@example.com"
                    required
                    register={register("email", { required: "Email is required" })}
                    error={errors.email?.message}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 font-semibold text-base flex items-center justify-center group"
                    style={{ backgroundColor: '#4F46E5', color: 'white' }}
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Sending Code...' : (
                      <>
                        Send Reset Code
                        <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  <div className="text-center pt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Link>
                  </div>
                </form>
              </>
            )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;