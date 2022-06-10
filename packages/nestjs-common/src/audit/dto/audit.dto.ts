import { IsNumber, IsString } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  AuditDateCreated,
  AuditDateDeleted,
  AuditDateUpdated,
  AuditInterface,
  AuditVersion,
} from '@concepta/ts-core';

/**
 * Audit DTO
 */
@Exclude()
export class AuditDto implements AuditInterface {
  /**
   * Date created
   */
  @Expose({ toPlainOnly: true })
  @ApiProperty({
    type: Date,
    description: 'Date created',
  })
  @IsString()
  dateCreated: AuditDateCreated = new Date();

  /**
   * Date updated
   */
  @Expose({ toPlainOnly: true })
  @ApiProperty({
    type: Date,
    description: 'Date updated',
  })
  @IsString()
  dateUpdated: AuditDateUpdated = new Date();

  /**
   * Date deleted
   */
  @Expose({ toPlainOnly: true })
  @ApiProperty({
    type: Date,
    description: 'Date deleted',
  })
  @IsString()
  dateDeleted: AuditDateDeleted | null = null;

  /**
   * Version
   */
  @Expose({ toPlainOnly: true })
  @ApiProperty({
    type: 'number',
    description: 'Version of the data',
  })
  @IsNumber()
  version: AuditVersion = 0;
}
