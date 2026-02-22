import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { VerifyCallback } from 'passport-oauth2';
import { UserAccountConfig } from '../config/user-account.config';
import axios from 'axios';
import { OAuthProfileDto } from '../../auth/api/input-dto/oauth-profile.input-dto';
import { AuthService } from '../../auth/application/auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private authService: AuthService,
    private userAccountConfig: UserAccountConfig,
  ) {
    super({
      clientID: userAccountConfig.GITHUB_CLIENT_ID,
      clientSecret: userAccountConfig.GITHUB_CLIENT_SECRET,
      callbackURL: userAccountConfig.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const typedProfile = profile as {
      id: string;
      username?: string;
      displayName?: string;
      emails?: Array<{ value: string }>;
    };

    let emails = typedProfile.emails;

    if (!emails || emails.length === 0) {
      try {
        const fetchedEmails = await this.getUserEmails(accessToken);
        emails = fetchedEmails;
      } catch (error) {
        console.error('Error fetching emails from GitHub:', error);
      }
    }

    const oauthProfile: OAuthProfileDto = {
      id: typedProfile.id,
      username: typedProfile.username,
      displayName: typedProfile.displayName,
      emails: emails,
    };
    const user = await this.authService.validateOAuth(
      oauthProfile,
      'github',
    );

    done(null, user);
  }
  private async getUserEmails(
    accessToken: string,
  ): Promise<Array<{ value: string }>> {
    const response = await axios.get<
      Array<{
        email: string;
        primary: boolean;
        verified: boolean;
      }>
    >('https://api.github.com/user/emails', {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'Your-App-Name',
      },
    });

    return response.data.map((email) => ({
      value: email.email,
    }));
  }
}
