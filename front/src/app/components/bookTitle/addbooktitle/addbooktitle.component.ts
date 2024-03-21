import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit, ViewChild } from "@angular/core";
import { DauSach } from "src/app/_model/models/book.model";
import { Sys0202Service } from "src/app/_service/sys/book/sys0202.service";
import { CommonConstant } from "src/app/_constant/common.constants";
import Swal from "sweetalert2";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Editor from 'ckeditor5-custom-build/build/ckeditor.js';

import { FileService } from "src/app/_service/comm/file.service";
import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
declare var window: any;
import { saveAs } from "file-saver";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MyUploadAdapter } from "./UploadAdapter";
import { GenreBook } from "src/app/_model/models/genreBook.model";
import { NgImageSliderComponent } from "ng-image-slider";
import axios from "axios";
import { environment } from "src/environments/environment";
import { HeadersUtil } from "src/app/_util/headers-util";

export interface ImageObject {
  image: string;
  thumbImage: string;
}

@Component({
  selector: "add-book-title",
  templateUrl: "./addbooktitle.component.html",
  styleUrls: ["./addbooktitle.component.scss"],
})
export class AddBookTitleComponent implements OnInit {
  myForm: FormGroup;
  previewImage: any;
  file: File;
  files: File[] = [];
  bookTitle: DauSach = {
    bookCode: "",
    title: "",
    publisher: "",
    price: 0,
    pages: 0,
    description: "",
    status: "1",
    numberAccess: 0,
    author: "",
    createdYear: 2023,
    category: 0,
    img: "",
    genres: [],
    images: [],
    imagesSrc: [],
  };
  genreAll: GenreBook[] = [];
  quantity: number = 1;
  selectedGenre: GenreBook[];

  name = "Angular";
  numberValue = 0;
  textValue = "0";
  textNumberValue = "0";
  addEbook: boolean;

  //upload file
  // filenames: string[] = ['1.txt', 'LeThiNa.pdf'];
  // fileStatus = { status: '', requestType: '', percent: 0 };

  fileEBookUpload: string = "Chọn ebook";
  public Editor = ClassicEditor;

  editorConfig = {
    placeholder: "Type here..",
  };
  description: any;

  imageObjectPreview: ImageObject[] = [];
  imageObject: ImageObject[] = [];
  indexCurrentImageShow: number;

  @ViewChild("nav") navSlider: NgImageSliderComponent;

  constructor(
    private dauSachService: DauSachService,
    private sys0202Service: Sys0202Service,
    private router: Router,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService
  ) {
    this.myForm = this.fb.group({
      title: ["", Validators.required],
      author: ["", Validators.required],
      publisher: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParamMap.subscribe((params) => {
      let type = params.get("type");
      if (type === "sach_in") {
        this.addEbook = false;
      } else {
        this.addEbook = true;
      }
    });

    this.imageObject = [];

    this.sys0202Service.getAllGenres().subscribe((response) => {
      if (response.status === CommonConstant.RESULT_OK)
        this.genreAll = response.responseData;
    });

    this.bookTitle.imagesSrc = [];
    let imageSrc = this.fileService.getFile("no-image.png");
    if (imageSrc) {
      this.imageObjectPreview = [];
      this.imageObjectPreview.unshift({
        image: imageSrc,
        thumbImage: imageSrc,
      });
      this.bookTitle.imagesSrc.push(imageSrc);
    }
  }

  onReady($event) {
    $event.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
    $event.editing.view.document.on(
      "delete",
      (evt: any, data: any) => {
        const selection = $event.model.document.selection;
        const firstPosition = selection.getFirstPosition();
        const nodeAfter = firstPosition.nodeAfter;
        if (nodeAfter && nodeAfter.name == "imageBlock") {
          let url = nodeAfter.getAttribute("src");
          let api = environment.backApiUrl + `/public/getImage`;
          // Tách URL thành các phần riêng biệt
          const parts = url.split("/");
          let nameImage = parts[parts.length - 1];
          // Thiết lập các headers
          const headers: HttpHeaders = HeadersUtil.getHeadersAuthCover();

          api = api + "/" + nameImage;
          axios
            .get(`${api}`, { params: { type: "DELETE" } })
            .then((rep) => {})
            .catch((err) => {});
        }
      },
      { priority: "highest" }
    );
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.files.unshift(event.target.files[0]);

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        // this.previewImage = event.target!.result;
        if (event.target!.result !== null) {
          this.bookTitle.imagesSrc[0] = event.target!.result as string;
          this.imageObjectPreview = [];
          this.imageObjectPreview.unshift({
            image: event.target!.result as string,
            thumbImage: event.target!.result as string,
          });
          this.imageObject.unshift({
            image: event.target!.result as string,
            thumbImage: event.target!.result as string,
          });
        }
      };
    }
    // hiển thị ảnh ở ảnh to nhất
    // this.file = event.target.files[0];
  }

  get registerFormControl() {
    return this.myForm.controls;
  }

  error_title: string = "";
  error_author: string = "";
  error_publisher: string = "";
  error_description: string = "";
  error_createdYear: string = "";
  error_page: string = "";
  error_price: string = "";
  addBookTitle() {
    let isValidate = true;

    if (this.bookTitle.title === "") {
      this.error_title = "Tiêu đề không được để trống";
      isValidate = false;
    } else {
      this.error_title = "";
    }

    if (this.bookTitle.title!.length > 100) {
      this.error_title = "Tiêu đề không được quá 50 ký tự";
      isValidate = false;
    } else {
      this.error_title = "";
    }

    if (this.bookTitle.author === "") {
      this.error_author = "Tác giả không được để trống";
      isValidate = false;
    } else {
      this.error_author = "";
    }

    if (this.bookTitle.publisher === "") {
      this.error_publisher = "Nhà xuất bản không được để trống";
      isValidate = false;
    } else {
      this.error_publisher = "";
    }

    if (this.bookTitle.description!.length > 6000) {
      this.error_description = "Mô tả không được quá 6000 ký tự";
      isValidate = false;
    } else {
      this.error_description = "";
    }

    if (
      this.bookTitle.createdYear! > 2023 ||
      this.bookTitle.createdYear! < 2000
    ) {
      this.error_createdYear = "Năm xuất bản không hợp lệ";
      isValidate = false;
    } else {
      this.error_createdYear = "";
    }

    if (this.bookTitle.pages! < 1) {
      this.error_page = "Số trang không hợp lệ";
      isValidate = false;
    } else {
      this.error_page = "";
    }

    if (this.bookTitle.price! < 0) {
      this.error_price = "Giá sách không hợp lệ";
      isValidate = false;
    } else {
      this.error_price = "";
    }

    if (isValidate === true) {
      if (this.addEbook) this.bookTitle.ebook = true;
      else {
        this.bookTitle.ebook = false;
      }
      this.dauSachService.postData(this.bookTitle, this.quantity).subscribe(
        (response) => {
          if (response.status === "NG") {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Thêm không thành công!",
              footer: '<a href="">Sách đã tồn tại trong hệ thống</a>',
            });
          } else {
            // Swal.fire({
            //   icon: "success",
            //   title: "Thành công",
            //   text: "Thêm thành công!",
            // }).then(() => {
            //   if (this.files) {
            //     const formData = new FormData();
            //     this.files.forEach((file: File) => {
            //       formData.append("files", file);
            //     });
            //     formData.append("bookCode", response.responseData.bookCode);
            //     this.dauSachService.addCover(formData, []).subscribe();
            //   }
            //   this.onUploadEbook(response.responseData.bookCode);
            //   this.router.navigate(["/sys/list-dausach"]);
            // });
            if (this.files) {
              const formData = new FormData();
              this.files.forEach((file: File) => {
                formData.append("files", file);
              });
              formData.append("update", "0");
              formData.append("bookCode", response.responseData.bookCode);
              this.dauSachService.addCover(formData, []).subscribe();
            }
            this.onUploadEbook(response.responseData.bookCode);
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Thêm thành công!",
            }).then(() => {
              this.router.navigate(["/sys/list-dausach"]);
            });
          }
        },
        (error) => {}
      );
    }
  }

  isSelected(genre_id: number): boolean {
    for (let i of this.bookTitle.genres!) {
      if (genre_id == i.genre_id) return true;
    }
    return false;
  }

  toggleChoice(item: GenreBook) {
    if (this.isSelected(item.genre_id!)) {
      this.bookTitle.genres = this.bookTitle.genres!.filter((i) => i !== item);
    } else {
      this.bookTitle.genres!.push(item);
    }
  }

  handleMinus(event) {
    event.preventDefault();
    if (this.quantity > 0) this.quantity--;
  }
  handlePlus(event) {
    event.preventDefault();
    this.quantity++;
  }

  fileEbook: File[];

  getFileEbook(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.fileEbook = Array.from(inputElement.files);
      this.fileEBookUpload = this.fileEbook[0].name;
    }
  }

  onUploadEbook(bookCode: string): void {
    if (this.fileEbook?.length > 0) {
      const formData = new FormData();
      for (const file of this.fileEbook) {
        formData.append("files", file);
        formData.append("bookCode", bookCode);
      }

      const fileList = formData.getAll("files");

      // Lặp qua từng tệp tin và hiển thị thông tin
      for (const file of fileList) {
      }
      this.fileService.upload(formData).subscribe(
        (event) => {},
        (error: HttpErrorResponse) => {}
      );
    }
  }

  generateQrCode(bookCode: string): void {
    this.fileService.generateQrCode(bookCode).subscribe();
  }

  // define a function to download files
  onDownloadFile(filename: string): void {
    this.fileService
      .download(filename)
      .subscribe((blob) => saveAs(blob, filename));
  }

  removeImage() {
    //xoá ảnh đó trong imageObject
    this.imageObject.splice(this.indexCurrentImageShow, 1);
    this.files.splice(this.indexCurrentImageShow, 1);

    //sau khi xoá thêm ảnh mới vào iamageObjectPreview
    //kiểm tra nếu indexCurrentImageShow đã quá length của imageObject thì nó sẽ bằng 0
    if ((this.indexCurrentImageShow = this.imageObject.length)) {
      this.indexCurrentImageShow = 0;
    }

    this.imageObjectPreview = [];
    if (this.imageObject.length > 0) {
      this.imageObjectPreview.unshift({
        image: this.imageObject[this.indexCurrentImageShow].image,
        thumbImage: this.imageObject[this.indexCurrentImageShow].thumbImage,
      });
    } else {
      let imageSrc = this.fileService.getFile("no-image.png");
      if (imageSrc) {
        this.imageObjectPreview = [];
        this.imageObjectPreview.unshift({
          image: imageSrc,
          thumbImage: imageSrc,
        });
      }
    }
  }

  imageClickHandler(e) {
    this.imageObjectPreview = [];
    this.indexCurrentImageShow = e;
    this.imageObjectPreview.unshift({
      image: this.imageObject[e].image,
      thumbImage: this.imageObject[e].thumbImage,
    });
  }

  changCatAddBookTitle() {
    let type = "ebook";
    if (this.addEbook) {
      type = "sach_in";
    } else {
      type = "ebook";
    }
    this.router.navigate(["/sys/list-dausach/add"], {
      queryParams: { type: type },
    });
  }
}
