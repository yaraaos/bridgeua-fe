import { apiClient } from '../../../services/api/client';
import { ENDPOINTS } from '../../../services/api/endpoints';

import type {
  ConfirmCodePayload,
  ConfirmCodeResponse,
  ForgotPasswordPayload,
  ForgotPasswordResponse,
  RegisterBusinessPayload,
  RegisterBusinessResponse,
  RegisterPersonalPayload,
  RegisterResponse,
  ResendCodePayload,
  ResendCodeResponse,
  ResetPasswordPayload,
  ResetPasswordResponse,
  SignInPayload,
  SignInResponse,
} from "../types/auth.types";

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  const res = await apiClient.post<SignInResponse>(ENDPOINTS.AUTH_LOGIN, payload);
  return res.data;
}

export async function registerPersonal(
  payload: RegisterPersonalPayload,
): Promise<RegisterResponse> {
  const res = await apiClient.post<RegisterResponse>(ENDPOINTS.AUTH_REGISTER_PERSONAL, payload);
  return res.data;
}

export async function registerBusiness(
  payload: RegisterBusinessPayload,
): Promise<RegisterBusinessResponse> {
  const res = await apiClient.post<RegisterBusinessResponse>(ENDPOINTS.AUTH_REGISTER_BUSINESS, payload);
  return res.data;
}

export async function confirmCode(
  payload: ConfirmCodePayload,
): Promise<ConfirmCodeResponse> {
  const res = await apiClient.post<ConfirmCodeResponse>(ENDPOINTS.AUTH_CONFIRM_CODE, payload);
  return res.data;
}

export async function resendCode(
  payload: ResendCodePayload,
): Promise<ResendCodeResponse> {
  const res = await apiClient.post<ResendCodeResponse>(ENDPOINTS.AUTH_RESEND_CODE, payload);
  return res.data;
}

export async function forgotPassword(
  payload: ForgotPasswordPayload,
): Promise<ForgotPasswordResponse> {
  const res = await apiClient.post<ForgotPasswordResponse>(ENDPOINTS.AUTH_FORGOT_PASSWORD, payload);
  return res.data;
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResponse> {
  const res = await apiClient.post<ResetPasswordResponse>(ENDPOINTS.AUTH_RESET_PASSWORD, payload);
  return res.data;
}

