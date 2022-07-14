import { Logger, Module } from '@nestjs/common';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { CrudModule } from '@concepta/nestjs-crud';
import { OtpModule, OtpService } from '@concepta/nestjs-otp';
import { EmailModule, EmailService } from '@concepta/nestjs-email';
import {
  UserLookupService,
  UserModule,
  UserMutateService,
} from '@concepta/nestjs-user';
import { EmailSendOptionsInterface } from '@concepta/ts-common';

import { InvitationModule } from '../invitation.module';
import { default as ormConfig } from './invitation.ormconfig.fixture';
import { InvitationUserOtpEntityFixture } from './invitation-user-otp-entity.fixture';
import { InvitationUserEntityFixture } from './invitation-user-entity.fixture';

@Module({
  imports: [
    TypeOrmExtModule.registerAsync({
      useFactory: async () => {
        return ormConfig;
      },
    }),
    CrudModule.register(),
    EmailModule.register({}),
    InvitationModule.registerAsync({
      imports: [
        UserModule.deferred(),
        OtpModule.deferred(),
        EmailModule.deferred(),
      ],
      inject: [UserLookupService, UserMutateService, OtpService, EmailService],
      useFactory: (
        userLookupService,
        userMutateService,
        otpService,
        emailService,
      ) => ({
        userLookupService,
        userMutateService,
        otpService,
        emailService,
      }),
    }),
    OtpModule.register({
      entities: {
        userOtp: {
          entity: InvitationUserOtpEntityFixture,
        },
      },
    }),
    UserModule.register({
      entities: {
        user: {
          entity: InvitationUserEntityFixture,
        },
      },
    }),
    EmailModule.register({
      mailerService: {
        sendMail(sendMailOptions: EmailSendOptionsInterface): Promise<void> {
          Logger.debug('email sent', sendMailOptions);

          return Promise.resolve();
        },
      },
    }),
  ],
})
export class InvitationAppModuleFixture {}
