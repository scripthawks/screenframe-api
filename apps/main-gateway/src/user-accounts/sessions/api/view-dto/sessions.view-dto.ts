import { ApiProperty } from '@nestjs/swagger';
import { Session } from '../../domain/session.entity';

export class SessionsViewDto {
  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  deviceId: string;

  static mapToView(session: Session): SessionsViewDto {
    const model = new SessionsViewDto();
    model.deviceName = session.deviceName;
    model.ipAddress = session.ipAddress;
    model.deviceId = session.id;
    return model;
  }
}
