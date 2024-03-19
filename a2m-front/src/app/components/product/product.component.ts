import { User0202Service } from "../../_service/user/phieumuon/user0202.service";
import { DauSach } from "src/app/_model/models/book.model";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { DataResponse } from "src/app/_model/resp/data-response";
import { CommonConstant } from "src/app/_constant/common.constants";
import { User0101Service } from "src/app/_service/user/user0101.service";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { ToastrService } from "ngx-toastr";
import { User0102Service } from "src/app/_service/user/user0102.service";
import Swal from "sweetalert2";
import { DataService } from "src/app/_service/comm/data.service";
import { FileService } from "src/app/_service/comm/file.service";
import { saveAs } from "file-saver";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { User0201Service } from "src/app/_service/user/phieumuon/user0201.service";
import { GenreBook } from "src/app/_model/models/genreBook.model";
import { ImageObject } from "../bookTitle/addbooktitle/addbooktitle.component";
import { MyUploadAdapter } from "../bookTitle/addbooktitle/UploadAdapter";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

declare let $: any;

@Component({
  selector: "mg-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  imageObjectPreview: ImageObject[] = [];
  imageObject: ImageObject[] = [];

  // id: number;
  product;
  bookTitle: DauSach;
  // thumbimages: any[] = [];
  id: string = "";
  ebookSrc: string;
  safeDescription: SafeHtml;
  comment: string = "";
  // public Editor = ClassicEditor;
  @Input() readonly: boolean = true;

  @ViewChild("quantity") quantityInput;

  public Editor = ClassicEditor;
  public EditorComment = ClassicEditor;

  imageToShowSrc: string;
  // @ViewChild('imageURL')
  //   imageURL: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authen: AuthenticationService,
    private dauSach: DauSachService,
    private user0101Service: User0101Service,
    private user0102Service: User0102Service,
    private user0201Service: User0201Service,
    private user0202Service: User0202Service,
    private toast: ToastrService,
    private dataService: DataService,
    private router: Router,
    private fileService: FileService,
    private sanitizer: DomSanitizer
  ) {}

  editorConfig = {
    placeholder: "Type here..",
    toolbar: [],
  };

  editorConfigComment = {
    placeholder: "Type here..",
  };

  title = "ckeditorAngular10";
  @Input() config = {
    toolbar: {
      items: [
        "heading",
        "|",
        "fontfamily",
        "fontsize",
        "alignment",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "strikethrough",
        "underline",
        "subscript",
        "superscript",
        "|",
        "link",
        "|",
        "outdent",
        "indent",
        "|",
        "bulletedList",
        "-",
        "numberedList",
        "todoList",
        "|",
        "code",
        "codeBlock",
        "|",
        "insertTable",
        "|",
        "imageUpload",
        "blockQuote",
        "|",
        "todoList",
        "undo",
        "redo",
      ],
      shouldNotGroupWhenFull: true,
    },
    image: {
      // Configure the available styles.
      styles: ["alignLeft", "alignCenter", "alignRight"],

      // Configure the available image resize options.
      resizeOptions: [
        {
          name: "resizeImage:original",
          label: "Original",
          value: null,
        },
        {
          name: "resizeImage:50",
          label: "25%",
          value: "25",
        },
        {
          name: "resizeImage:50",
          label: "50%",
          value: "50",
        },
        {
          name: "resizeImage:75",
          label: "75%",
          value: "75",
        },
      ],

      // You need to configure the image toolbar, too, so it shows the new style
      // buttons as well as the resize buttons.
      toolbar: [
        "imageStyle:alignLeft",
        "imageStyle:alignCenter",
        "imageStyle:alignRight",
        "|",
        "ImageResize",
        "|",
        "imageTextAlternative",
      ],
    },
    // simpleUpload: {
    //    The URL that the images are uploaded to.
    // uploadUrl: 'http://localhost:52536/api/Image/ImageUpload',

    //   Enable the XMLHttpRequest.withCredentials property.

    //},

    language: "en",
  };

  ngOnInit(): void {
    this.id = "" + this.activatedRoute.snapshot.paramMap.get("id");

    this.dauSach.getBookTitleDetail(this.id).subscribe({
      next: (resp: DataResponse) => {
        console.log(resp.responseData);
        if (resp.status == CommonConstant.RESULT_OK)
          this.bookTitle = resp.responseData as DauSach;
        // if (this.bookTitle.description) {
        //   this.safeDescription = this.sanitizer.bypassSecurityTrustHtml(this.bookTitle.description);
        // }

        this.bookTitle.bookCode = this.id;
        // this.imageSrc = this.fileService.getImages(this.bookTitle?.images[0].path)

        this.bookTitle.imagesSrc = [];
        if (this.bookTitle.images.length > 0) {
          for (let j = 0; j < this.bookTitle?.images?.length; j++) {
            let imgSrc = this.fileService.getImages(
              this.bookTitle.images[j].path
            );
            // console.log("imageSrc", imgSrc)
            // this.bookTitle.imagesSrc?.push(imgSrc);
            if (this.bookTitle?.images[j].about === 1) {
              this.bookTitle.ebook = 1;
              this.ebookSrc = this.bookTitle?.images[j].path!;
            }
            if (this.bookTitle.images[j].about === 2) {
            } else {
              // this.bookTitle.imagesSrc?.push(imgSrc);
              this.imageObject.push({
                image: imgSrc,
                thumbImage: imgSrc,
              });
            }
          }

          this.imageObjectPreview = [];
          this.imageObjectPreview.push(this.imageObject[0]);
          // hien thi 1 anh
          // this.imageToShowSrc = "";
          // for (let j = 0; j < this.bookTitle.images.length; j++) {
          //   if (this.bookTitle.images[j].about === 0) {
          //     this.imageToShowSrc = this.bookTitle.imagesSrc[j];
          //     break;
          //   }
          // }
          // console.log("listBookTitle", this.bookInCart[0].imagesSrc)
        }
      },
      error: (err: any) => {},
    });
  }

  onReady($event) {
    $event.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  addBookToCart() {
    if (this.bookTitle.status === "0") {
      this.toast.error("Sách đã ngừng cung cấp!");
    } else {
      this.user0101Service.insert(this.bookTitle).subscribe((resp) => {
        if (resp.status == CommonConstant.RESULT_WN) {
          this.authen.logIn();
        } else if (resp.status == CommonConstant.RESULT_OK) {
          this.dauSach.getBookAvailable(this.id).subscribe(
            (response) => {
              console.log("Checking book available");
              if (response.responseData) {
                this.toast.success(resp.message);
              } else {
                this.toast.error("Hiện tại sách đã hết!");
              }
            },
            (error) => {
              console.log("Error checking book available");
            }
          );
        } else if (resp.status == CommonConstant.RESULT_NG) {
          this.toast.error(resp.message);
        }
      });
    }
  }

  addBookToWaitList() {
    this.user0102Service.insert(this.bookTitle).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_WN) {
          this.authen.logIn();
        } else if (resp.status == CommonConstant.RESULT_OK) {
          this.toast.success(resp.message);
          // this.sse.connect()
        } else if (resp.status == CommonConstant.RESULT_NG) {
          this.toast.error(resp.message);
        }
        // else if()
      },
    });

    // this.sse.connect()
  }

  borrow() {
    this.user0201Service.checkPhieuMuonExists().subscribe((response) => {
      if (response.status === CommonConstant.RESULT_WN) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Bạn chưa đăng nhập, vui lòng đăng nhập trước khi mượn sách",
        }).then(() => {
          this.authen.logIn();
        });
      } else if (this.bookTitle.status === "0") {
        this.toast.error("Sách đã ngừng cung cấp!");
      }
      // else if (this.bookTitle.status == "0") {
      //   this.toast.error("Sách đã ngừng cung cấp!")
      // }
      else {
        const phieumuonNumber = response.responseData;
        if (phieumuonNumber !== 0) {
          // this.toast.error("Bạn còn phiếu mượn chưa trả! Vui lòng trả phiếu mượn trước khi mượn thêm sách");
          this.toast.error(
            "Bạn còn phiếu mượn đang trong trạng thái chờ! Bạn chỉ có thể có tối đa 1 phiếu ở trạng thái chờ"
          );
        } else {
          this.dauSach.getBookAvailable(this.id).subscribe(
            (response) => {
              console.log("Checking book available");
              if (response.responseData) {
                this.router.navigate(["/user/checkout"], {
                  state: { data: [this.bookTitle.bookCode] },
                });
              } else {
                this.toast.error("Hiện tại sách đã hết!");
              }
            },
            (error) => {
              console.log("Error checking book available");
            }
          );
        }
      }
    });
  }

  navigateToHome(genreBook: GenreBook) {
    this.dataService.setNavigateToGenre(true);
    this.router.navigate(["/home"], {
      queryParams: { page: 1, category: genreBook.genre_id },
    });
  }

  // ngAfterViewInit(): void {

  //   // Product Main img Slick
  //   $('#product-main-img').slick({
  //     infinite: true,
  //     speed: 300,
  //     dots: false,
  //     arrows: true,
  //     fade: true,
  //     asNavFor: '#product-imgs',
  //   });

  //   // Product imgs Slick
  //   $('#product-imgs').slick({
  //     slidesToShow: 3,
  //     slidesToScroll: 1,
  //     arrows: true,
  //     centerMode: true,
  //     focusOnSelect: true,
  //     centerPadding: 0,
  //     vertical: true,
  //     asNavFor: '#product-main-img',
  //     responsive: [{
  //       breakpoint: 991,
  //       settings: {
  //         vertical: false,
  //         arrows: false,
  //         dots: true,
  //       }
  //     },
  //     ]
  //   });

  //   // Product img zoom
  //   var zoomMainProduct = document.getElementById('product-main-img');
  //   if (zoomMainProduct) {
  //     $('#product-main-img .product-preview').zoom();
  //   }
  // }

  genreNav(genre: GenreBook) {
    this.router.navigate(["/home"], {
      queryParams: { category: genre.genre_id, page: 1 },
    });
  }

  // define a function to download files
  // onDownloadFile(filename: string): void {

  //   this.fileService.download(filename).subscribe(
  //     // event => {
  //     //   console.log(event);
  //     //   // this.resportProgress(event);
  //     // },
  //     // (error: HttpErrorResponse) => {
  //     //   console.log(error);
  //     // }
  //     blob => saveAs(blob, filename)
  //   );
  // }

  onDownloadFile(): void {
    if (this.bookTitle.bookCode) {
      this.fileService.download(this.ebookSrc).subscribe(
        // event => {
        //   console.log(event);
        //   // this.resportProgress(event);
        // },
        // (error: HttpErrorResponse) => {
        //   console.log(error);
        // }
        (blob) => saveAs(blob, this.bookTitle.bookCode + ".pdf")
      );
    }
  }

  showBookOnline($event: any): void {
    // if (this.bookTitle.bookCode) {
    //   this.fileService.download(this.bookTitle.bookCode).subscribe(res => {
    //     let blob: Blob = res as Blob;
    //     let url = window.URL.createObjectURL(blob);
    //     console.log("url")
    //     console.log(url)
    //     window.open(url)
    //   });
    // }

    if (this.bookTitle.bookCode) {
      let url = this.fileService.getImages(this.ebookSrc);
      window.open(url);
    }
  }

  urlPreview = "http://localhost:8096/api/public/download/BXIZ";

  imageClickHandler(e) {
    console.log("image click", e);
    this.imageObjectPreview = [];
    this.imageObjectPreview.unshift({
      image: this.imageObject[e].image,
      thumbImage: this.imageObject[e].thumbImage,
    });
  }
}
