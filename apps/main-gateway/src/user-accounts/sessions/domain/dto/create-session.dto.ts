export class CreateSessionDto {
  userId: string;

  sessionId: string;

  deviceName: string;

  ipAddress: string;

  expiresAt: number;

  lastActive: number;
}
