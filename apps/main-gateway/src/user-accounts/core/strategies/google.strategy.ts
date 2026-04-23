import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UserAccountConfig } from '../config/user-account.config';
import { OAuthProfileDto } from '../../auth/api/input-dto/oauth-profile.input-dto';
import { AuthService } from '../../auth/application/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private userAccountConfig: UserAccountConfig,
  ) {
    super({
      clientID: userAccountConfig.GOOGLE_CLIENT_ID,
      clientSecret: userAccountConfig.GOOGLE_CLIENT_SECRET,
      callbackURL: userAccountConfig.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const oauthProfile: OAuthProfileDto = {
      id: profile.id,
      displayName: profile.displayName,
      emails: profile.emails,
    };

    return await this.authService.validateOAuth(oauthProfile, 'google');
  }
}
