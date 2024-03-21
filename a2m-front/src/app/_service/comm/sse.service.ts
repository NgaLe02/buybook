import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { User0104Service } from "../user/user0104.service";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class SseService {
  private events: EventSource;
  private notification: any;
  private notificationSubject: Subject<any> = new Subject<any>();

  dataUser = new BehaviorSubject<any>({});
  currentDataUser = this.dataUser.asObservable();

  changeUserData(data: any) {
    this.dataUser.next(data);
  }

  constructor(
    private user0104Service: User0104Service,
    public toast: ToastrService
  ) {}

  connect(userUid?: string) {
    if (userUid === undefined) {
      return;
    }

    this.events = new EventSource(
      environment.backApiUrl + `/public/subscribe/${userUid}`
    );

    this.events.onmessage = (event) => {
      this.notification = event.data;
      this.toast.info(this.notification, "Thông báo", { onActivateTick: true });
    };

    this.events.onerror = (e) => {
      this.events.close();
    };
  }

  getNotification(): Observable<any> {
    return this.notificationSubject.asObservable();
  }

  disconnect() {
    if (this.events) {
      this.events.close();
    }
  }
}
