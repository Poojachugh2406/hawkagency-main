import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Package, Lock, Mail, Eye, EyeOff, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
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

const MediatorResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                    navigate('/mediator/login');
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

    // Branding Panel Component - Mediator Theme
    const BrandingPanel: React.FC = () => (
        <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
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
                <p className="text-lg text-teal-100 font-light">
                    Enter the verification code sent to your professional email and create a new secure password for your mediator account.
                </p>
            </div>

            <div className="z-10 text-sm text-teal-200">
                &copy; {new Date().getFullYear()} Brand Mediators. All rights reserved.
            </div>

            <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
                <svg className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] text-emerald-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100c55.23 0 100-44.77 100-100S155.23 0 100 0z" clipRule="evenodd" />
                </svg>
                <svg className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] text-teal-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M170.7 50c9.4 12.5 14.3 28.3 14.3 45 0 16.7-4.9 32.5-14.3 45s-23.3 20-38.2 20c-14.9 0-28.8-7.5-38.2-20s-14.3-28.3-14.3-45 4.9-32.5 14.3-45 23.3-20 38.2-20c14.9 0 28.8 7.5 38.2 20z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );

    // Mobile Header Component
    const MobileHeader: React.FC = () => (
        <div className="flex items-center space-x-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                <Package className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Brand Mediators</h1>
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

                    {success ? (<div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h3>
                        <p className="text-gray-600 mb-4">
                            Your mediator account password has been reset successfully. Redirecting to login...
                        </p>
                        <div className="space-y-4">
                            <Button
                                onClick={() => navigate('/mediator/login')}
                                variant="primary"
                                className="w-full py-3 font-semibold text-base flex items-center justify-center group"
                                style={{ backgroundColor: '#059669', color: 'white' }}
                            >
                                Go to Mediator Login
                                <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>) : (
                        <>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Reset Mediator Password
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Enter the verification code and create your new secure password.
                            </p>

                            <FormProvider {...methods}>
                                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                                    {error && <Alert type="error" message={error} />}

                                    {location.state?.email && (
                                        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                                            <p className="text-sm text-emerald-800 text-center">
                                                ✓ Reset code sent to <strong>{watch('email')}</strong>
                                            </p>
                                        </div>
                                    )}

                                    <Input
                                        label="Professional Email"
                                        type="email"
                                        icon={<Mail className="h-5 w-5" />}
                                        placeholder="mediator@example.com"
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
                                        focusColor="emerald"
                                        filledColor="emerald"
                                        className="mt-4" 
                                    />

                                    <Input
                                        label="New Password"
                                        type={showPassword ? 'text' : 'password'}
                                        icon={<Lock className="h-5 w-5" />}
                                        placeholder="Enter new secure password (min. 6 characters)"
                                        required
                                        rightIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        }
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
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        icon={<Lock className="h-5 w-5" />}
                                        placeholder="Confirm your new password"
                                        required
                                        rightIcon={
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        }
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password'
                                        })}
                                        error={errors.confirmPassword?.message}
                                    />

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full py-3 font-semibold text-base flex items-center justify-center group"
                                        style={{ backgroundColor: '#059669', color: 'white' }}
                                        isLoading={isLoading}
                                    >
                                        {isLoading ? 'Resetting Password...' : (
                                            <>
                                                Reset Mediator Password
                                                <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                                            </>
                                        )}
                                    </Button>

                                    <div className="flex items-center justify-between pt-4">
                                        <Link
                                            to="/mediator/login"
                                            className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Back to Mediator Login
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => navigate('/mediator/forgot-password')}
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

export default MediatorResetPassword;