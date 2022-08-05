import { EventAsyncInterface } from './interfaces/event-async.interface';
import { Event } from './event';

/**
 * Abstract async event class.
 *
 * To create a custom **async** event, extend the
 * {@link EventAsync} class.
 *
 * You can override and customize the [payload]{@link Event#payload} getter
 * if desired. Please read the documentation for the abstract {@link Event} class
 * for the complete documentation.
 *
 * For synchronous events, see the {@link EventSync} abstract class.
 *
 * ### Example
 * ```ts
 * // event payload type
 * type MyPayloadType = {id: number, active: boolean};
 *
 * // event class
 * class MyEvent extends EventAsync<MyPayloadType> {}
 *
 * // create an event
 * const myEvent = new MyEvent({id: 1234, active: true});
 * ```
 */
export abstract class EventAsync<P = undefined, R = P>
  extends Event<P, Promise<R>>
  implements EventAsyncInterface<P, R> {}
