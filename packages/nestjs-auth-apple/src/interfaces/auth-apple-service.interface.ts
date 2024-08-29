import { AuthAppleProfileInterface } from './auth-apple-profile.interface';

export interface AuthAppleServiceInterface {
  verifyIdToken(idToken: string): Promise<AuthAppleProfileInterface>;
  validateClaims(tokenPayload: AuthAppleProfileInterface): void;
}
