import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider, ProviderType } from '../domain/provider.entity';

@Injectable()
export class ProvidersRepository {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async getUserAuthAccountByProviderAndProviderId(
    provider: 'google' | 'github',
    providerId: string,
  ): Promise<Provider | null> {
    const providerType =
      provider === 'github' ? ProviderType.GIT_HUB : ProviderType.GOOGLE;

    return await this.providerRepository.findOne({
      where: {
        providerAccountId: providerId,
        type: providerType,
      },
      relations: ['user'],
    });
  }

  async createAuthAccountForUser(
    userId: string,
    provider: 'google' | 'github',
    providerId: string,
  ): Promise<Provider> {
    const providerType =
      provider === 'github' ? ProviderType.GIT_HUB : ProviderType.GOOGLE;

    const authAccount = Provider.create({
      userId,
      providerAccountId: providerId,
      type: providerType,
    });

    return await this.providerRepository.save(authAccount);
  }
}
