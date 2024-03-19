import { Component, OnInit, OnDestroy } from '@angular/core';
import { SseService } from 'src/app/_service/comm/sse.service';
import { Subscription, forkJoin, map } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { User0104Service } from 'src/app/_service/user/user0104.service';
import { Notifications } from 'src/app/_model/models/notifications.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DauSachService } from 'src/app/_service/services/dausach.service';
import { FileService } from 'src/app/_service/comm/file.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit, OnDestroy {


  private subscription: Subscription;

  notifications: Notifications[] = [];
  panelExpanded: Number;
  isAllRead: Boolean;
  showDetail: boolean = false;
  subscriptions: Subscription[] = [];
  listId: string[] = [];
  listImg: string[] = [];

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 5;
  // tableSizes: any = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

  imageToShowSrc: string[] = []

  constructor(private sseService: SseService,
    private user0104Service: User0104Service,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dauSach: DauSachService,
    private fileService: FileService,

  ) { }


  ngOnInit() {

    this.isAllRead = false;
    this.showDetail = false;

    this.subscriptions.push(
      this.user0104Service.countTotalNoti().subscribe(data => {

      })
    )

    this.subscriptions.push(
      this.user0104Service.getQuantityNotis().subscribe(quantity => {
        // console.log(quantity)
        if (quantity.valueOf() % 5 === 0) {
          this.maxPage = quantity.valueOf() / 5;
        } else {
          this.maxPage = Math.floor(quantity.valueOf() / 5) + 1;
        }

        // console.log(this.maxPage)
      })
    )

    // this.subscriptions.push(
    //   this.user0104Service.getNotificationOfUser(this.pageCurrent).subscribe(data => {
    //   })
    // )

    this.subscriptions.push(
      this.user0104Service.getNotification().subscribe(notifications => {
        this.notifications = []
        this.notifications = notifications!;

        this.imageToShowSrc = []

        console.log("notifications", this.notifications)

          for (let i = 0; i < this.notifications.length; i++) {
            if (this.notifications[i].about == 0) {
                for (let j = 0; j < this.notifications[i]!.book!.images?.length; j++) {
                  if(this.notifications[i].book?.images[j].about === 0){
                    this.imageToShowSrc.push(this.fileService.getImages(this.notifications[i]!.book!.images[j].path))
                    break
                  }
                }   
            }
            else {
              this.imageToShowSrc.push("https://cdn-icons-png.flaticon.com/128/9546/9546489.png")
            }
          }
          console.log("imageToShowSrc", this.imageToShowSrc)
       
      })
    )

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"))

      if (this.pageCurrent == 0) {
        this.pageCurrent = 1
      }

      this.notifications = []
      this.user0104Service.getNotificationOfUser(this.pageCurrent).subscribe(data => {

      })
    })
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  changeShowDetail(index: number) {
    if (this.panelExpanded === index) {
      this.panelExpanded = -1;
    }
    else {
      this.panelExpanded = index;
    }
    this.showDetail = !this.showDetail;
  }

  isHovered = false;

  onMouseEnter() {
    this.isHovered = true;
  }

  onMouseLeave() {
    this.isHovered = false;
  }


  changeIcon() {

  }

  isReadTrueAll() {

    for (let n of this.notifications) {
      if (n.notification_id !== undefined) {
        this.listId.push(n.notification_id)
      }
    }

    this.user0104Service.updateIsRead(this.listId).subscribe(data => {

    })
  }

  showDetailNotification(notification: Notifications) {

    if (notification.about == 0) {
      this.router.navigate(['/home/book', notification.id]).then(() => {
      });
    }
    else {
      if (notification.phieuMuon?.status == 0) {
        this.router.navigate(['/user/phieumuon/status/0']).then(() => {

        });
      }
      else if (notification.phieuMuon?.status == 1) {
        this.router.navigate(['/user/phieumuon/status/1']).then(() => {

        });
      }
      else if (notification.phieuMuon?.status == 2) {
        this.router.navigate(['/user/phieumuon/chi-tiet', notification.id], { queryParams: { status: 2 } }).then(() => {
        });
      }

      else if (notification.phieuMuon?.status == 3) {
        this.router.navigate(['/user/phieumuon/chi-tiet', notification.id], { queryParams: { status: 3 } }).then(() => {
        });
      }
    }

    if (notification.notification_id !== undefined) {
      this.listId.push(notification.notification_id);
    }
    this.user0104Service.updateIsRead(this.listId).subscribe(data => {

    })

  }

  appendQueryParam(page: Number) {
    if (page != 0) {
      this.router.navigate(['/user/notification'], { queryParams: { page: page } })
    }
  }
  showPagePrvious() {
    if (this.pageCurrent > 1) {
      this.pageCurrent -= 1
      this.router.navigate(['/user/notification'], { queryParams: { page: this.pageCurrent } })
    }
  }

  showPageNext() {
    console.log(this.maxPage)
    if (this.pageCurrent.valueOf() < this.maxPage.valueOf()) {
      this.pageCurrent += 1;
      this.router.navigate(['/user/notification'], { queryParams: { page: this.pageCurrent } })

    }
  }

  changePage(event: any): void {
    console.log(event)
    // this.tableSize = event;
    this.pageCurrent = event;
    this.router.navigate(['/user/notification'], { queryParams: { page: this.pageCurrent } })

  }
}