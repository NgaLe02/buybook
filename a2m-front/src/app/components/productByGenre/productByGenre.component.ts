import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from 'src/app/_service/services/product.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DauSachService } from 'src/app/_service/services/dausach.service';
import { DataResponse } from 'src/app/_model/resp/data-response';
import { User0101Service } from 'src/app/_service/user/user0101.service';
import { CommonConstant } from 'src/app/_constant/common.constants';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/app/_service/auth/authentication.service';
import { SearchService } from 'src/app/_service/comm/common.service';
import { AuthConstant } from 'src/app/_constant/auth.constant';
import { Cookie } from 'ng2-cookies';
import { DauSach, Sach } from 'src/app/_model/models/book.model';
import { UserInfo } from 'src/app/_model/auth/user-info';
import { Modal } from 'bootstrap'
import { forkJoin, map } from 'rxjs';
@Component({
  selector: 'mg-product-by-genre',
  templateUrl: './productByGenre.component.html',
  styleUrls: ['./productByGenre.component.scss']
})


export class ProductByGenreComponent implements OnInit {

  // products: ProductModelServer[] = [];
  isAuthenticate: boolean = false;
  inputText: string = '';
  listBookTitle: DauSach[] = [];
  genre_id: number;
  imageArray: string[] = [];

  public data: DauSach[];
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


  //pagination
  pageCurrent: number = 1;
  maxPage: number = 2;
  tableSize: number = 5;
  // tableSizes: any = [2, 4, 6, 8]
  // status: number = 1;
  // numbersArray: Number[] = [];
  constructor(private authen: AuthenticationService,
    private toast: ToastrService,
    private router: Router,
    private dauSach: DauSachService,
    private user0101Service: User0101Service,
    private activatedRoute: ActivatedRoute,
    private searchService: SearchService
  ) {
  }


  showBookDetail(book: DauSach) {
    this.router.navigate(['/home/book', book.bookCode]).then(() => {
    });


  }

  ngOnInit(): void {

    this.genre_id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
      this.isAuthenticate = true;
    }
    this.getBookTitle();

    // this.getBookTitle();

    // if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
    // this.loading.change(true);
    // this.fetchData();
    // this.formModalDetail = new window.bootstrap.Modal(
    //   document.getElementById('modal-detail-cat')
    // );
    // this.formModalDisable = new window.bootstrap.Modal(
    //   document.getElementById('modal-disable-cat')
    // );
    // this.formModalEnable = new window.bootstrap.Modal(
    //   document.getElementById('modal-enable-cat')
    // );
    // }

    this.activatedRoute.queryParamMap.subscribe((param) => {
      this.pageCurrent = Number(param.get("page"))
      // this.statusSearch = (param.get("status")) ?? ""
      if (this.pageCurrent == 0) {
        this.pageCurrent = 1
      }
      this.getBookTitle();
    })
  }

  getBookTitle() {
    this.dauSach.getBookTitleByGenre(this.genre_id, this.pageCurrent).pipe(
      map((response) => {
        this.listBookTitle = []
        this.listBookTitle = response.responseData;
        console.log(this.listBookTitle)
        let subscribeList: any[] = [];
        this.imageArray = [];
        for (let i = 0; i < this.listBookTitle.length; i++) {
          if (this.listBookTitle[i].img) {
            subscribeList.push(this.dauSach.getCover(this.listBookTitle[i].img!));
          }
          else {
            subscribeList.push(this.dauSach.getCover("no-image.png"));
          }
        }
        forkJoin(subscribeList).pipe(
          map((respArr) => {
            // console.log(respArr);
            for (let item of respArr) {
              if (item.responseData) this.imageArray.push('data:image/jpeg;base64,' + item.responseData);
            }
            // console.log(this.imageArray)
          })
        ).subscribe();
      }
      )
    ).subscribe();
  }
  // fetchData() {
  //   this.dauSach.getData().subscribe(
  //     (response) => {
  //       this.data = response.responseData;
  //       console.log(response);
  //     },
  //     (error) => {
  //       console.error('Error fetching data:', error);
  //     }
  //   )
  // }

  // setStatus(status: number) {
  //   this.status = status;
  // }

  openModel(item: DauSach) {
    if(item.bookCode){
      this.dauSach.getBookDetail(item.bookCode).subscribe(
        (response) => {
          this.dausachDetail = response.responseData;
          console.log(response);
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      )
      
    }
    if(this.dausachDetail.genres){
       this.genre_list = this.dausachDetail.genres.map(item => item.genre_name).join(', ');
    }
      // this.dausachDetail = item;
      if(item.bookCode){
        this.dauSach.getBookData(item.bookCode).subscribe(
          (response) => {
            this.bookdata = response.responseData;
            console.log(response);
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
    this.dauSach.changeStatus(0, this.disableBookCode).subscribe();
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
    this.dauSach.changeStatus(1, this.enableBookCode).subscribe();
    this.formModalEnable.hide();
    window.location.reload();
  }

  changePage(event: any): void {
    console.log(event)
    this.pageCurrent = event;
    this.router.navigate(['/sys/list-categories', this.genre_id], { queryParams: { page: this.pageCurrent } })

  }

}
