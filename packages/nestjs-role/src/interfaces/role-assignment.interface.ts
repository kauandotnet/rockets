import {
  ReferenceAuditInterface,
  ReferenceIdInterface,
} from '@concepta/ts-core';
import { RoleAssignableInterface } from './role-assignable.interface';

export interface RoleAssignmentInterface
  extends ReferenceIdInterface,
    ReferenceAuditInterface,
    RoleAssignableInterface {
  /**
   * Role
   */
  role: ReferenceIdInterface;
}
