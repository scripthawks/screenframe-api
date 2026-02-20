import { ApiProperty } from '@nestjs/swagger';
import { Session } from '../../domain/session.entity';

export class SessionsViewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  deviceName: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty({ type: Date })
  lastActiveDate: Date;

  static mapToView(session: Session): SessionsViewDto {
    const model = new SessionsViewDto();
    model.id = session.id;
    model.deviceName = session.deviceName;
    model.ipAddress = session.ipAddress;
    model.lastActiveDate = session.lastActive;
    return model;
  }
}
