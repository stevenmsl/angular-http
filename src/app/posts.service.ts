import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType,
} from '@angular/common/http';

import { Post } from './post.model';
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private url = 'https://angular-http-backend-29575.firebaseio.com/posts.json';
  constructor(private http: HttpClient) {}

  error = new Subject<string>();

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };
    // Send Http request
    // xxxx.json is required by Firebase specifically
    this.http
      .post(this.url, postData, {
        // get the entire HttpResponse
        observe: 'response',
      })
      // if no one subscribe to this observable
      // the request won’t even got sent
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => this.error.next(error.message)
      );
  }

  fetchPosts() {
    /*
      - SearchParams needs to be mutable as append will 
        return a new instance of HttpParams.
      - Call append multiple times to add  more parameters 
    */
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    // Note: Firebase won’t recognize this parameter.
    searchParams = searchParams.append('custom', 'key');

    /*
      - use pipe and map to transform the data 
    */
    return this.http
      .get<{ [key: string]: Post }>(this.url, {
        headers: new HttpHeaders({ Custom_Header: 'Hello' }),
        params: searchParams,
        responseType: 'json', // this is the default setting
      })
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          // in case you want to implement additional logic
          // before sending back the error to the clients
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete(this.url, {
        observe: 'events',
      })
      .pipe(
        // tap - perform a side effect for every emission on the source Observable,
        // but return an Observable that is identical to the source.
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
