import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}
  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // run something before a request is handled
    return handler.handle().pipe(
      map((data: any) => {
        // run something after a request is handled
        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

// SYNTAX

// export class SerializeInterceptor implements NestInterceptor {
//     intercept(
//       context: ExecutionContext,
//       handler: CallHandler<any>,
//     ): Observable<any> | Promise<Observable<any>> {
//       // run something before a request is handled
//       console.log({ context });

//       return handler.handle().pipe(
//         map((data: any) => {
//           // run something after a request is handled
//           console.log({ data });
//         }),
//       );
//     }
//   }
