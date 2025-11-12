


import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Package, 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  Phone, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { authAPI } from '@/utils/api';
import Alert from '@/components/UI/Alert';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import OtpInput from '@/components/UI/OtpInput';

// Types
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  nickName?: string;
}

interface VerifyFormData {
  email: string;
  otp: string[];
}

// Branding Panel Component
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
        Start your journey with us.
      </h2>
      <p className="text-lg text-indigo-100 font-light">
        Create an account to get access to your dashboard and manage your orders and refund forms.
      </p>
    </div>

    <div className="z-10 text-sm text-indigo-200">
      &copy; {new Date().getFullYear()} Brand Boosters. All rights reserved.
    </div>

    <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
      <svg className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] text-sky-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100c55.23 0 100-44.77 100-100S155.23 0 100 0z" clipRule="evenodd"/>
      </svg>
      <svg className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] text-indigo-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M170.7 50c9.4 12.5 14.3 28.3 14.3 45 0 16.7-4.9 32.5-14.3 45s-23.3 20-38.2 20c-14.9 0-28.8-7.5-38.2-20s-14.3-28.3-14.3-45 4.9-32.5 14.3-45 23.3-20 38.2-20c14.9 0 28.8 7.5 38.2 20z" clipRule="evenodd"/>
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

// Registration Form Component
interface RegistrationFormProps {
  form: any;
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
  form, 
  onSubmit, 
  isLoading, 
  error 
}) => {

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Create your Account
      </h2>
      <p className="mt-2 text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
          Log in
        </Link>
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {error && <Alert type="error" message={error} />}
        
        <div className='grid md:grid-cols-2 gap-3'>
          <Input
            label="Full Name"
            type="text"
            icon={<User className="h-5 w-5" />}
            placeholder="Enter your full name"
            required
            {...form.register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
            error={form.formState.errors.name?.message}
          />
          <Input
            label="Nick Name (Optional)"
            type="text"
            icon={<User className="h-5 w-5" />}
            placeholder="Enter a nick name"
            {...form.register('nickName')}
            error={form.formState.errors.nickName?.message}
          />
        </div>

        <Input
          label="Email Address"
          type="email"
          icon={<Mail className="h-5 w-5" />}
          placeholder="you@gmail.com"
          required
          {...form.register('email', {
            required: 'Email is required',
            pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i , message: 'Invalid email address' }
          })}
          error={form.formState.errors.email?.message}
        />

        <Input
          label="Phone Number"
          type="tel"
          icon={<Phone className="h-5 w-5" />}
          placeholder="e.g., 9725512345"
          required
          {...form.register('phone', {
            required: 'Phone number is required',
            pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit phone number' }
          })}
          error={form.formState.errors.phone?.message}
        />

        <Input
          label="Password"
          type={'password'}
          icon={<Lock className="h-5 w-5" />}
          placeholder="Create a password"
          required
         
          {...form.register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' }
          })}
          error={form.formState.errors.password?.message}
        />

        <Input
          label="Confirm Password"
          type={'password'}
          icon={<Lock className="h-5 w-5" />}
          placeholder="Confirm your password"
          required
         
          {...form.register('confirmPassword', {
            required: 'Please confirm your password'
          })}
          error={form.formState.errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3 font-semibold text-base flex items-center justify-center group"
          style={{ backgroundColor: '#4F46E5', color: 'white' }}
          isLoading={isLoading}
        >
          {isLoading ? 'Creating Account...' : (
            <>
              Create Account
              <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

// Verification Form Component
interface VerificationFormProps {
  form: any;
  onSubmit: (data: VerifyFormData) => Promise<void>;
  onResendOTP: () => Promise<void>;
  onBackToRegister: () => void;
  registeredEmail: string;
  isLoading: boolean;
  error: string | null;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  form,
  onSubmit,
  onResendOTP,
  onBackToRegister,
  registeredEmail,
  isLoading,
  error
}) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">
        Check your Email
      </h2>
      <p className="mt-2 text-gray-600">
        We've sent a 6-digit verification code to your email address.
      </p>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
          {error && <Alert type="error" message={error} />}

          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
            <p className="text-sm text-indigo-800 text-center">
              Code sent to <strong>{registeredEmail}</strong>
            </p>
          </div>
          
          <Input
            label="Email"
            type="email"
            icon={<Mail className="h-5 w-5" />}
            placeholder="Enter your email"
            {...form.register('email', {
              required: 'Email is required',
              pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
            })}
            error={form.formState.errors.email?.message}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />

          <OtpInput
            name="otp"
            length={6}
            required={true}
            error={form.formState.errors.otp?.message as string}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 font-semibold text-base flex items-center justify-center group"
            style={{ backgroundColor: '#4F46E5', color: 'white' }}
            isLoading={isLoading}
          >
            {isLoading ? 'Verifying...' : (
              <>
                Verify Account
                <CheckCircle className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={onResendOTP}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              Resend Code
            </button>
            <button
              type="button"
              onClick={onBackToRegister}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Register</span>
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

// Main Register Component
const Register: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerForm = useForm<RegisterFormData>();
  const verifyForm = useForm<VerifyFormData>({
    defaultValues: {
      otp: Array(6).fill('')
    }
  });

  const onSubmitRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        nickName: data.nickName
      });

      if (response.success) {
        toast.success('Registration successful! Please check your email for verification code.');
        setRegisteredEmail(data.email);
        
        // Reset and initialize verification form
        verifyForm.reset({
          email: data.email,
          otp: Array(6).fill('')
        });
        setStep('verify');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitVerify = async (data: VerifyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Convert array to string for API
      const otpString = data.otp.join('');
      const response = await authAPI.verify({
        email: data.email,
        otp: otpString
      });
      
      if (response.success) {
        toast.success('Account verified successfully!');
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      const errorMessage = error.response.data.message ||error.message || 'Verification failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const email = registeredEmail || verifyForm.getValues('email');
      if (!email) {
        toast.error('Email address not found.');
        return;
      }
      
      toast.loading('Sending new code...');
      const response = await authAPI.resendVerification(email);
      toast.dismiss();
      
      if (response.success) {
        toast.success('Verification code sent successfully!');
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Failed to resend verification code');
    }
  };

  const handleBackToRegister = () => {
    setStep('register');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
      <BrandingPanel />
      
      <div className="flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-16 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <MobileHeader />
          
          {step === 'register' ? (
            <RegistrationForm
              form={registerForm}
              onSubmit={onSubmitRegister}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <VerificationForm
              form={verifyForm}
              onSubmit={onSubmitVerify}
              onResendOTP={handleResendOTP}
              onBackToRegister={handleBackToRegister}
              registeredEmail={registeredEmail}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;