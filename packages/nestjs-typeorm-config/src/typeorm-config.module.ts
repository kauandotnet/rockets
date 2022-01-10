import { Connection, ConnectionOptions } from 'typeorm';
import { Global, Module } from '@nestjs/common';
import {
  getConnectionName,
  getConnectionToken,
  TypeOrmModule,
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import {
  AsyncModuleConfig,
  createConfigurableDynamicRootModule,
} from '@rockts-org/nestjs-common';
import { TypeOrmConfigService } from './typeorm-config.service';
import {
  TYPEORM_CONFIG_MODULE_CONNECTION,
  TYPEORM_CONFIG_MODULE_OPTIONS_TOKEN,
} from './typeorm-config.constants';
import { TypeOrmConfigOptions } from './typeorm-config.types';
import { TypeOrmConfigStorage } from './typeorm-config.storage';
import { TypeOrmConfigMetaDataInterface } from './interfaces/typeorm-config-metadata.interface';

@Global()
@Module({
  providers: [TypeOrmConfigService],
  exports: [TypeOrmConfigService],
})
export class TypeOrmConfigModule extends createConfigurableDynamicRootModule<
  TypeOrmConfigModule,
  TypeOrmConfigOptions
>(TYPEORM_CONFIG_MODULE_OPTIONS_TOKEN, {
  exports: [
    TYPEORM_CONFIG_MODULE_CONNECTION,
    TYPEORM_CONFIG_MODULE_OPTIONS_TOKEN,
  ],
}) {
  static register(options: TypeOrmConfigOptions) {
    const module = TypeOrmConfigModule.forRoot(TypeOrmConfigModule, options);

    module.imports.push(
      TypeOrmModule.forRootAsync({
        inject: [TYPEORM_CONFIG_MODULE_OPTIONS_TOKEN],
        useFactory: async (options: TypeOrmModuleOptions) => {
          // return the merged options
          return TypeOrmConfigModule.mergeTypeOrmOptions(
            getConnectionName(options as ConnectionOptions),
            options as ConnectionOptions,
          );
        },
      }),
    );

    module.providers.push(
      this.createConnectionProvider(options as ConnectionOptions),
    );
    module.global = true;
    return module;
  }

  static registerAsync(
    options: TypeOrmModuleAsyncOptions &
      AsyncModuleConfig<TypeOrmConfigOptions>,
  ) {
    const module = TypeOrmConfigModule.forRootAsync(
      TypeOrmConfigModule,
      options,
    );

    module.imports.push(
      TypeOrmModule.forRootAsync({
        inject: [TYPEORM_CONFIG_MODULE_OPTIONS_TOKEN],
        useFactory: async (options: TypeOrmModuleOptions) => {
          // return the merged options
          return TypeOrmConfigModule.mergeTypeOrmOptions(
            getConnectionName(options as ConnectionOptions),
            options as ConnectionOptions,
          );
        },
        connectionFactory: options.connectionFactory,
      }),
    );

    module.providers.push(this.createConnectionProvider(options.name));
    module.global = true;
    return module;
  }

  static deferred(timeout = 2000) {
    return TypeOrmConfigModule.externallyConfigured(
      TypeOrmConfigModule,
      timeout,
    );
  }

  static configure(
    metaData: TypeOrmConfigMetaDataInterface,
    defaultMetaData: TypeOrmConfigMetaDataInterface = {},
  ) {
    TypeOrmConfigStorage.addConfig(metaData, defaultMetaData);
  }

  private static createConnectionProvider(
    connection?: string | ConnectionOptions,
  ) {
    return {
      provide: TYPEORM_CONFIG_MODULE_CONNECTION,
      inject: [getConnectionToken(connection)],
      useFactory: async (connection: Connection) => connection,
    };
  }

  private static mergeTypeOrmOptions(
    connectionName: string,
    options: ConnectionOptions,
  ) {
    const entities =
      TypeOrmConfigStorage.getEntitiesByConnection(connectionName);

    const subscribers =
      TypeOrmConfigStorage.getSubscribersByConnection(connectionName);

    return {
      ...options,
      entities: [
        ...(options.entities ?? []),
        ...(entities ? entities.map((entity) => entity.useClass) : []),
      ],
      subscribers: [
        ...(options.subscribers ?? []),
        ...(subscribers
          ? subscribers.map((subscriber) => subscriber.useClass)
          : []),
      ],
    };
  }
}
