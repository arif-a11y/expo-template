/**
 * Auth feature public API - Clerk Integration
 *
 * This is the single entry point for the auth feature.
 * Other parts of the app should import from this file only.
 */

// Hooks
export {
  useAuth,
  useLogin,
  useRegister,
  useVerifyEmail,
  useForgotPassword,
  useResetPassword,
  useGoogleOAuth,
  useAppleOAuth,
  useWarmUpBrowser,
} from './hooks/useAuth';

// Schemas
export {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from './schemas/auth.schema';
export type {
  LoginFormData,
  RegisterFormData,
  ForgotPasswordFormData,
  ResetPasswordFormData,
  VerifyEmailFormData,
} from './schemas/auth.schema';

// Components
export { LoginForm } from './components/LoginForm';
export { RegisterForm } from './components/RegisterForm';
export { ForgotPasswordForm } from './components/ForgotPasswordForm';
export { ResetPasswordForm } from './components/ResetPasswordForm';
export { VerifyEmailForm } from './components/VerifyEmailForm';
export { SocialSignInButtons } from './components/SocialSignInButtons';
export { FormInput } from './components/FormInput';
