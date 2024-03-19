import { Component, OnInit } from '@angular/core';
import { UserInfo } from 'src/app/_model/auth/user-info';
import { AuthenticationService } from 'src/app/_service/auth/authentication.service';
import { LoaderService } from 'src/app/_service/comm/loader.service';
import { DauSachService } from 'src/app/_service/services/dausach.service';
import { ToastrService } from 'ngx-toastr';
import { DauSach, Sach } from 'src/app/_model/models/book.model';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { FileService } from 'src/app/_service/comm/file.service';

declare var window: any;

@Component({
  selector: 'book-title',
  templateUrl: './booktitle.component.html',
  styleUrls: ['./booktitle.component.css']
})
export class BookTitleComponent implements OnInit {
  public data: DauSach[];
  dataActive: DauSach[] = []
  dataDisable: DauSach[] = []
  public bookdata: Sach[];
  formModalDetail: any;
  formModalDisable: any;
  formModalEnable: any;
  disableBookCode: string;
  enableBookCode: string;
  genre_list: string;
  dausachDetail: DauSach = {
    bookCode: '',
    title: '',
    publisher: '',
    price: 0,
    pages: 0,
    description: '',
    status: '0',
    author: '',
    createdYear: 0,
    category: 0,
    img: '',
    genres: [],
    images: [],
    imagesSrc: []
  };
  quantity: 0;

  status: string = '1';
  numbersArray: Number[] = [];

  //pagination
  pageCurrent: number = 1;
  maxPage: number;
  tableSize: number = 5;

  imageToShowActiveSrc: string[] = []
  imageToShowDisableSrc: string[] = []


  constructor(
    private loading: LoaderService,
    private dauSachService: DauSachService,
    private fileService: FileService,


  ) { }

  userInfo = new UserInfo();

  setStatus(status: string) {
    this.status = status;
    this.pageCurrent = 1;
  }

  ngOnInit(): void {

    this.loading.change(true);
    this.fetchData();
    // this.formModalDetail = new window.bootstrap.Modal(
    //   document.getElementById('modal-detail-cat')
    // );
    this.formModalDisable = new window.bootstrap.Modal(
      document.getElementById('modal-disable-cat')
    );
    // this.formModalEnable = new window.bootstrap.Modal(
    //   document.getElementById('modal-enable-cat')
    // );


  }

  fetchData() {
    this.dauSachService.getData().pipe(
      map((response) => {
        this.data = []
        this.data = response.responseData;
        console.log("data", this.data);
        this.dataActive = [];
        this.dataDisable = [];

        for (let i = 0; i < this.data.length; i++) {
          this.data[i].imagesSrc = []
          for (let j = 0; j < this.data[i]?.images?.length; j++) {
            let imgSrc = this.fileService.getImages(this.data[i].images[j].path);
            // console.log("imageSrc", imgSrc)
            this.data[i].imagesSrc?.push(imgSrc)
          }
          // console.log("listBookTitle", this.bookInCart[0].imagesSrc)
        }

        this.imageToShowActiveSrc = []
        this.imageToShowDisableSrc = []

        // console.log(this.imageToShowSrc)

        for (let c of this.data) {
          if (c.status == '1') {
            this.dataActive.push(c)
            for (let j = 0; j < c?.images.length; j++) {
              if(c.images[j].about ===  0){
                this.imageToShowActiveSrc.push(c.imagesSrc[j])
                break
              }
            }
          }
          else if (c.status == '0') {
            this.dataDisable.push(c)
            for (let j = 0; j < c?.images.length; j++) {
              if(c.images[j].about ===  0){
                this.imageToShowDisableSrc.push(c.imagesSrc[j])
                break
              }
            }
          }
        }


      })
    ).subscribe();

  }

  openModel(item: DauSach) {
    if(item.bookCode){
      this.dauSachService.getBookDetail(item.bookCode).subscribe(
        (response) => {
          this.dausachDetail = response.responseData;
          // console.log(response);
        },
        (error) => {
          // console.error('Error fetching data:', error);
        }
      )
    }
   if(this.dausachDetail.genres){
    this.genre_list = this.dausachDetail.genres.map(item => item.genre_name).join(', ');

   }
   if(item.bookCode){
    this.dauSachService.getBookData(item.bookCode).subscribe(
      (response) => {
        this.bookdata = response.responseData;
        // console.log(response);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    )
   }
    
    this.formModalDetail.show();
  }

  closeModel() {
    this.formModalDetail.hide();
  }

  openModelDisable(bookCode: string) {
    this.disableBookCode = bookCode;
    this.formModalDisable.show();
  }

  closeModelDisable() {
    this.disableBookCode = '';
    this.formModalDisable.hide();
  }
  disable() {
    this.dauSachService.changeStatus(0, this.disableBookCode).subscribe();
    this.formModalDisable.hide();
    window.location.reload();
  }

  openModelEnable(bookCode: string) {
    this.enableBookCode = bookCode;
    this.formModalEnable.show();
  }

  closeModelEnable() {
    this.enableBookCode = '';
    this.formModalEnable.hide();
  }

  enable() {
    this.dauSachService.changeStatus(1, this.enableBookCode).subscribe();
    this.formModalEnable.hide();
    window.location.reload();
  }

  changePage(event: any): void {
    // console.log(event)
    this.pageCurrent = event;
    // this.router.navigate(['/sys/list-dausach'], { queryParams: { page: this.pageCurrent } })

  }
}
