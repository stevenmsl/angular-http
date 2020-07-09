import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/*
   You need to register this interceptor in the app.module 
   providers: [
     {
       provide: HTTP_INTERCEPTORS,
       useClass: AuthInterceptorService,
       multi: true,
     },
   ],

*/

export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // console.log('Request is on its way');

    // clone a new one and modify it
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'xyz'),
    });

    // let it continue by calling next.handle
    return next.handle(modifiedRequest).pipe(
      // check what is coming back in the response
      tap((event) => {
        //console.log(event);
        if (event.type == HttpEventType.Response) {
          // console.log(`Response arrived, body data:`);
          // console.log(event.body);
        }
      })
    );
  }
}
