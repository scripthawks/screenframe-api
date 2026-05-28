import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProfileViewDto } from '../user-accounts/users/api/view-dto/profile.view-dto';

export function ApiGetProfile() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get profile by user ID',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Profile has been successfully retrieved',
      type: ProfileViewDto,
    }),
  );
}
