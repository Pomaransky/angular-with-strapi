import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';
import { AnalyticsEventType } from '../constants/analytics-event-type.enum';
import { ApiService } from './api-service';

interface TrackEventResponse {
  ok: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService extends ApiService {
  track(eventType: AnalyticsEventType): Observable<TrackEventResponse> {
    return this.post<TrackEventResponse>('analytics/track', { eventType }).pipe(
      catchError(() => EMPTY),
    );
  }
}
