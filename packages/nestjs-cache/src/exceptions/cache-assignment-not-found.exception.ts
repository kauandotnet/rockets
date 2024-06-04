import { format } from 'util';
import { ExceptionInterface } from '@concepta/ts-core';

export class CacheAssignmentNotFoundException
  extends Error
  implements ExceptionInterface
{
  errorCode = 'CACHE_ASSIGNMENT_NOT_FOUND_ERROR';

  context: {
    assignmentName: string;
  };

  constructor(
    assignmentName: string,
    message = 'Assignment %s was not registered to be used.',
  ) {
    super(format(message, assignmentName));
    this.context = {
      assignmentName,
    };
  }
}
