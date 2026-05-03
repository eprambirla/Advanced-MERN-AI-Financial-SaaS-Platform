export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture: string | null;
  isEmailVerified?: boolean;
}

export interface UpdateUserResponse {
  data: User;
}

export interface ReportSetting {
  userId: string;
  frequency?: string;
  isEnabled: boolean;
}

export interface AuthState {
  accessToken: string | null;
  expiresAt: number | null;
  refreshToken: string | null;
  refreshExpiresAt: number | null;
  user: User | null;
  reportSetting: ReportSetting | null;
}

export interface SetCredentialsPayload {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
  refreshExpiresAt: number;
  user: User;
  reportSetting: ReportSetting | null;
}

export interface UpdateCredentialsPayload {
  accessToken?: string;
  expiresAt?: number;
  refreshToken?: string;
  refreshExpiresAt?: number;
  user?: Partial<User>;
  reportSetting?: Partial<ReportSetting>;
}