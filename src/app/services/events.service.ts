import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private fooSubject = new Subject<any>();

  constructor() { }

  publishSomeData(data: any) {
    this.fooSubject.next(data);
}

getObservable(): Subject<any> {
    return this.fooSubject;
}
}
