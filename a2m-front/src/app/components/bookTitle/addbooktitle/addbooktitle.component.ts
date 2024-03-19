import { Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { LoaderService } from "src/app/_service/comm/loader.service";
import { ToastrService } from "ngx-toastr";
import { DauSach } from "src/app/_model/models/book.model";
import { Sys0202Service } from "src/app/_service/sys/book/sys0202.service";
import { CommonConstant } from "src/app/_constant/common.constants";
import Swal from "sweetalert2";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import * as Editor from 'ckeditor5-custom-build/build/ckeditor.js';

import { FileService } from "src/app/_service/comm/file.service";
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
} from "@angular/common/http";
declare var window: any;
import { saveAs } from "file-saver";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Base64UploadAdapter } from "@ckeditor/ckeditor5-upload";
import { MyUploadAdapter } from "./UploadAdapter";
import { SearchService } from "src/app/_service/comm/common.service";
import { GenreBook } from "src/app/_model/models/genreBook.model";
import { NgImageSliderComponent } from "ng-image-slider";

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
    author: "",
    createdYear: 0,
    category: 0,
    img: "",
    genres: [],
    images: [],
    imagesSrc: [],
  };
  genreAll: GenreBook[] = [];
  quantity: number = 1;
  selectedGenre: GenreBook[];

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
    private fileService: FileService
  ) {
    this.myForm = this.fb.group({
      title: ["", Validators.required],
      author: ["", Validators.required],
      publisher: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.imageObject = [];

    this.sys0202Service.getAllGenres().subscribe((response) => {
      if (response.status === CommonConstant.RESULT_OK)
        this.genreAll = response.responseData;
      console.log(response.responseData);
    });

    // this.bookTitle.images = []
    this.bookTitle.imagesSrc = [];
    let imageSrc = this.fileService.getImages("no-image.png");
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
  }

  // onReady($event) {

  // }

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
          // if (this.imageObject.length == 0) {
          this.imageObjectPreview = [];
          // }
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

  addBookTitle() {
    let isValidate = true;

    if (this.bookTitle.title === "") {
      this.error_title = "Tiêu đề không được để trống";
      isValidate = false;
    }

    if (this.bookTitle.title!.length > 50) {
      this.error_title = "Tiêu đề không được quá 50 ký tự";
      isValidate = false;
    }

    if (this.bookTitle.author === "") {
      this.error_author = "Tác giả không được để trống";
      isValidate = false;
    }

    if (this.bookTitle.title!.length > 50) {
      this.error_author = "Tác giả không được quá 50 ký tự";
      isValidate = false;
    }

    if (this.bookTitle.publisher === "") {
      this.error_publisher = "Nhà xuất bản không được để trống";
      isValidate = false;
    }

    if (this.bookTitle.description!.length > 6000) {
      this.error_description = "Mô tả không được quá 6000 ký tự";
      isValidate = false;
    }

    if (isValidate === true) {
      console.log(this.selectedGenre);
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
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Thêm thành công!",
            }).then(() => {
              // if (this.file) {
              if (this.files) {
                const formData = new FormData();
                this.files.forEach((file: File) => {
                  formData.append("files", file);
                });
                formData.append("bookCode", response.responseData.bookCode);
                this.dauSachService.addCover(formData, []).subscribe();
              }
              this.onUploadEbook(response.responseData.bookCode);
              // this.generateQrCode(response.responseData.bookCode);
              this.router.navigate(["/sys/list-dausach"]);
            });
          }
        },
        (error) => {
          console.error("Error adding data:", error);
        }
      );
      // this.addDauSach.postGenre(this.selectedGenre);
      console.log(this.bookTitle);
      // window.location.reload();
    }
  }

  isSelected(genre_id: number): boolean {
    // console.log(this.selectedGenre);
    for (let i of this.bookTitle.genres!) {
      // console.log(genre_id);
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
    console.log(this.bookTitle.genres);
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
        console.log(file);
        // ...
      }
      this.fileService.upload(formData).subscribe(
        (event) => {
          console.log(event);
          // this.resportProgress(event);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
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
      let imageSrc = this.fileService.getImages("no-image.png");
      if (imageSrc) {
        this.imageObjectPreview = [];
        this.imageObjectPreview.unshift({
          image: imageSrc,
          thumbImage: imageSrc,
        });
      }
    }

    console.log("files", this.files);
  }

  imageClickHandler(e) {
    console.log("image click", e);
    this.imageObjectPreview = [];
    this.indexCurrentImageShow = e;
    this.imageObjectPreview.unshift({
      image: this.imageObject[e].image,
      thumbImage: this.imageObject[e].thumbImage,
    });
  }
}
