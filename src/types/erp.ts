/**
 * Types specific to the ERP communication layer.
 */

export interface ERPAuthResponse {
  success: boolean;
  message?: string;
  sessionId?: string; // Keep this server-side only
  requiresCaptcha?: boolean;
}

export interface ERPError {
  code: string;
  message: string;
  status?: number;
}
