
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { Package, Lock, Mail, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
// import { authAPI } from '@/utils/api';
// import Input from '@/components/UI/Input';
// import Button from '@/components/UI/Button';
// import Alert from '@/components/UI/Alert';

// interface ResetPasswordData {
//   email: string;
//   otp: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// const ResetPassword: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [formData, setFormData] = useState<ResetPasswordData>({
//     email: '',
//     otp: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   // Get email from location state or allow manual entry
//   useEffect(() => {
//     if (location.state?.email) {
//       setFormData(prev => ({
//         ...prev,
//         email: location.state.email
//       }));
//     }
//   }, [location.state]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     // Validation
//     if (!formData.email || !formData.otp || !formData.newPassword || !formData.confirmPassword) {
//       setError('All fields are required');
//       return;
//     }

//     if (formData.newPassword.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     if (formData.newPassword !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (!/^\d{6}$/.test(formData.otp)) {
//       setError('OTP must be 6 digits');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await authAPI.resetPassword({
//         email: formData.email,
//         otp: formData.otp,
//         newPassword: formData.newPassword
//       });

//       if (response.success) {
//         setSuccess(true);
//         toast.success('Password reset successfully!');
//         setTimeout(() => {
//           navigate('/login');
//         }, 2000);
//       }
//     } catch (error: any) {
//       console.error('Reset password error:', error);
//       setError(error.response.data.message || error.message || 'Failed to reset password');
//       toast.error(error.response.data.message || error.message || 'Failed to reset password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="h-8 w-8 text-green-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
//             <p className="text-gray-600 mb-6">
//               Your password has been reset successfully. Redirecting to login...
//             </p>
//             <Link
//               to="/login"
//               className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
//             >
//               Go to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center space-x-3 mb-6">
//             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <Package className="h-7 w-7 text-white" />
//             </div>
//             <div className="text-left">
//               <h1 className="text-3xl font-bold text-gray-900">Brand Boosters</h1>
//               <p className="text-gray-600 text-sm">Reset Your Password</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                 <Lock className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-white">Reset Password</h2>
//                 <p className="text-blue-100 text-sm">Enter your reset code and new password</p>
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-8 sm:px-8">
//             {error && <Alert type="error" message={error} />}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <Input
//                 label="Email Address"
//                 type="email"
//                 icon={<Mail className="h-5 w-5" />}
//                 placeholder="Enter your email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={!!location.state?.email} // Disable if email is passed from state
//                 className={location.state?.email ? "bg-gray-50" : ""}
//               />

//               {location.state?.email && (
//                 <p className="text-sm text-green-600 -mt-3">
//                   ✓ Email auto-filled from previous step
//                 </p>
//               )}

//               <Input
//                 label="Reset Code"
//                 type="text"
//                 placeholder="Enter 6-digit code from your email"
//                 name="otp"
//                 value={formData.otp}
//                 onChange={(e) => setFormData(prev => ({ 
//                   ...prev, 
//                   otp: e.target.value.replace(/\D/g, '').slice(0, 6) 
//                 }))}
//                 maxLength={6}
//                 required
//               />

//               <Input
//                 label="New Password"
//                 type={showPassword ? 'text' : 'password'}
//                 icon={<Lock className="h-5 w-5" />}
//                 placeholder="Enter new password (min. 6 characters)"
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 required
//                 rightIcon={
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 }
//               />

//               <Input
//                 label="Confirm New Password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 icon={<Lock className="h-5 w-5" />}
//                 placeholder="Confirm new password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 rightIcon={
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 }
//               />

//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="w-full py-3 font-semibold"
//                 isLoading={isLoading}
//               >
//                 Reset Password
//               </Button>
//             </form>

//             <div className="mt-6 text-center space-y-3">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Login
//               </Link>
//               <div>
//                 <button
//                   type="button"
//                   onClick={() => navigate('/forgot-password')}
//                   className="text-sm text-gray-600 hover:text-gray-700"
//                 >
//                   Didn't receive code? Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;



import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Package, Lock, Mail,  CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { authAPI } from '@/utils/api';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import Alert from '@/components/UI/Alert';
import OtpInput from '@/components/UI/OtpInput';
import { useForm, FormProvider } from 'react-hook-form';

interface ResetPasswordFormData {
  email: string;
  otp: string[];
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const methods = useForm<ResetPasswordFormData>({
    defaultValues: {
      otp: Array(6).fill('')
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError: setFormError,
    watch
  } = methods;

  // Get email from location state
  useEffect(() => {
    if (location.state?.email) {
      setValue('email', location.state.email);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);

    // Convert OTP array to string
    const otpString = data.otp.join('');

    if (!otpString || otpString.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setFormError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    if (data.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({
        email: data.email,
        otp: otpString,
        newPassword: data.newPassword
      });

      if (response.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to reset password');
      toast.error(error.response?.data?.message || error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

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
          Reset Your Password
        </h2>
        <p className="text-lg text-indigo-100 font-light">
          Enter the verification code sent to your email and create a new password to secure your account.
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

          {success ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
              <p className="text-gray-600 mb-4">
                Your password has been reset successfully. Redirecting to login...
              </p>
              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/login')}
                  variant="primary"
                  className="w-full py-3 font-semibold text-base flex items-center justify-center group"
                  style={{ backgroundColor: '#4F46E5', color: 'white' }}
                >
                  Go to Login
                  <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900">
                Reset Password
              </h2>
              <p className="mt-2 text-gray-600">
                Enter the verification code and create your new password.
              </p>

              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                  {error && <Alert type="error" message={error} />}

                  {location.state?.email && (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                      <p className="text-sm text-indigo-800 text-center">
                        ✓ Reset code sent to <strong>{watch('email')}</strong>
                      </p>
                    </div>
                  )}

                  <Input
                    label="Email Address"
                    type="email"
                    icon={<Mail className="h-5 w-5" />}
                    placeholder="your.email@example.com"
                    required
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    error={errors.email?.message}
                    disabled={!!location.state?.email}
                    className={location.state?.email ? "bg-gray-100 cursor-not-allowed" : ""}
                  />

                  <OtpInput
                    name="otp"
                    length={6}
                    required={true}
                    error={errors.otp?.message as string}
                  />

                  <Input
                    label="New Password"
                    type={'password'}
                    icon={<Lock className="h-5 w-5" />}
                    placeholder="Enter new password (min. 6 characters)"
                    required
                   
                    {...register('newPassword', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    error={errors.newPassword?.message}
                  />

                  <Input
                    label="Confirm New Password"
                    type={'password'}
                    icon={<Lock className="h-5 w-5" />}
                    placeholder="Confirm your new password"
                    required
                   
                    {...register('confirmPassword', {
                      required: 'Please confirm your password'
                    })}
                    error={errors.confirmPassword?.message}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 font-semibold text-base flex items-center justify-center group"
                    style={{ backgroundColor: '#4F46E5', color: 'white' }}
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Resetting Password...' : (
                      <>
                        Reset Password
                        <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-between pt-4">
                    <Link
                      to="/login"
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Login
                    </Link>
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-sm text-gray-600 hover:text-gray-800 font-medium hover:cursor-pointer"
                    >
                      Resend Code
                    </button>
                  </div>
                </form>
              </FormProvider>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;