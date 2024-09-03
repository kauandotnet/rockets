import { Inject, Injectable } from '@nestjs/common';
import { JwtIssueServiceInterface } from '../interfaces/jwt-issue-service.interface';
import { JwtServiceInterface } from '../interfaces/jwt-service.interface';
import {
  JWT_MODULE_JWT_ACCESS_SERVICE_TOKEN,
  JWT_MODULE_JWT_REFRESH_SERVICE_TOKEN,
} from '../jwt.constants';
import { JwtSignOptions, JwtSignStringOptions } from '../jwt.types';

@Injectable()
export class JwtIssueService implements JwtIssueServiceInterface {
  constructor(
    @Inject(JWT_MODULE_JWT_ACCESS_SERVICE_TOKEN)
    protected readonly jwtAccessService: JwtServiceInterface,
    @Inject(JWT_MODULE_JWT_REFRESH_SERVICE_TOKEN)
    protected readonly jwtRefreshService: JwtServiceInterface,
  ) {}

  accessToken(payload: string, options?: JwtSignStringOptions): Promise<string>;

  accessToken(
    payload: Buffer | object,
    options?: JwtSignOptions,
  ): Promise<string>;

  async accessToken(
    payload: string | Buffer | object,
    options?: JwtSignOptions,
  ) {
    if (typeof payload === 'string') {
      return this.jwtAccessService.signAsync(payload, options);
    } else {
      return this.jwtAccessService.signAsync(payload, options);
    }
  }

  refreshToken(
    payload: string,
    options?: JwtSignStringOptions,
  ): Promise<string>;

  refreshToken(
    payload: Buffer | object,
    options?: JwtSignOptions,
  ): Promise<string>;

  async refreshToken(
    payload: string | Buffer | object,
    options?: JwtSignOptions,
  ) {
    if (typeof payload === 'string') {
      return this.jwtRefreshService.signAsync(payload, options);
    } else {
      return this.jwtRefreshService.signAsync(payload, options);
    }
  }
}
