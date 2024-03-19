import { Sys0202Service } from "src/app/_service/sys/book/sys0202.service";
import { DauSach, Sach } from "src/app/_model/models/book.model";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { map } from "rxjs/operators";
import { DauSachService } from "src/app/_service/services/dausach.service";
import { CommonConstant } from "src/app/_constant/common.constants";
import Swal from "sweetalert2";
import { FileService } from "src/app/_service/comm/file.service";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { GenreBook } from "src/app/_model/models/genreBook.model";
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

declare let $: any;

export interface ImageEditObject {
  image: string;
  thumbImage: string;
  idImage: number;
}

@Component({
  selector: "sys-editbooktitle",
  templateUrl: "./editBookTitle.component.html",
  styleUrls: ["./editBookTitle.component.scss"],
})
export class EditBookTitleComponent implements OnInit {
  // id: number;
  product;
  bookTitle: DauSach = {
    bookCode: "",
    title: "",
    publisher: "",
    price: 0,
    pages: 0,
    description: "",
    status: "0",
    // status: 0,

    author: "",
    createdYear: 0,
    category: 0,
    img: "",
    genres: [],
    images: [],
    imagesSrc: [],
  };
  thumbimages: any[] = [];
  id: string = "";
  quantity: number = 0;
  bookList: Sach[] = [];
  status: number = 1;
  genreAll: GenreBook[] = [];
  selectedGenre: GenreBook[] = [];
  previewImage: any;
  qrCodeSrc: any;
  // file: File;

  imageToShowSrc: string;

  public Editor = ClassicEditor;

  imageObjectPreview: ImageEditObject[] = [];
  imageObject: ImageEditObject[] = [];
  indexCurrentImageShow: number;

  filesAdd: File[] = [];
  imageDelete: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dauSach: DauSachService,
    private sys0202Service: Sys0202Service,
    private router: Router,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.indexCurrentImageShow = 0;
    this.id = "" + this.activatedRoute.snapshot.paramMap.get("bookCode");
    this.dauSach
      .getBookTitleDetail(this.id)
      .pipe(
        map((resp) => {
          if (resp.status == CommonConstant.RESULT_OK)
            this.bookTitle = resp.responseData;
          this.bookTitle.bookCode = this.id;
          console.log("book", this.bookTitle);
          // gán giá trị của thuộc tính genres trong đối tượng this.bookTitle
          //  cho biến this.selectedGenre và đảm bảo rằng
          //  giá trị không bao giờ là null hoặc undefined.
          this.selectedGenre = this.bookTitle.genres!;

          this.bookTitle.imagesSrc = [];
          if (this.bookTitle.images.length > 0) {
            for (let j = 0; j < this.bookTitle?.images?.length; j++) {
              let imgSrc = this.fileService.getImages(
                this.bookTitle.images[j].path
              );
              // console.log("imageSrc", imgSrc)

              if (this.bookTitle.images[j].about === 2) {
                this.qrCodeSrc = imgSrc;
              } else {
                // this.bookTitle.imagesSrc?.push(imgSrc);
                // this.imageObjectPreview = [];
                // this.imageObjectPreview.unshift({
                //   image: imgSrc,
                //   thumbImage: imgSrc,
                //   idImage: this.bookTitle.images[j].id!,
                // });

                this.imageObject.unshift({
                  image: imgSrc,
                  thumbImage: imgSrc,
                  idImage: this.bookTitle.images[j].id!,
                });
              }
            }
            // console.log("listBookTitle", this.bookInCart[0].imagesSrc)
          } else {
            this.bookTitle.images[0].path = "no-image.png";
          }

          this.imageObjectPreview = [];
          this.imageObjectPreview.push(
            this.imageObject[this.imageObject.length - 1]
          );
          // hien thi 1 anh
          // this.imageToShowSrc = "";
          // for (let j = 0; j < this.bookTitle.images.length; j++) {
          //   if (this.bookTitle.images[j].about === 0) {
          //     this.imageToShowSrc = this.bookTitle.imagesSrc[j];
          //     this.previewImage = this.imageToShowSrc;
          //     break;
          //   }
          // }
        })
      )
      .subscribe();

    this.sys0202Service.getAllGenres().subscribe((response) => {
      if (response.status === CommonConstant.RESULT_OK)
        this.genreAll = response.responseData;
      console.log(response.responseData);
    });
  }

  isSelected(genre_id: number): boolean {
    // console.log(this.selectedGenre);
    for (let i of this.selectedGenre) {
      // console.log(genre_id);
      if (genre_id == i.genre_id) return true;
    }
    return false;
  }

  toggleChoice(item: GenreBook) {
    if (this.isSelected(item.genre_id!)) {
      this.selectedGenre = this.selectedGenre.filter((i) => i !== item);
    } else {
      this.selectedGenre.push(item);
    }
    console.log(this.selectedGenre);
  }

  setStatus(status: number) {
    this.status = status;
  }

  handleMinus() {
    this.quantity--;
  }
  handlePlus() {
    this.quantity++;
  }

  error_title: string = "";
  error_author: string = "";
  error_publisher: string = "";
  error_description: string = "";

  submit() {
    let isValidate = true;

    if (this.bookTitle.title === "") {
      this.error_title = "Tiêu đề không được để trống";
      isValidate = false;
    }

    if (this.bookTitle.author === "") {
      this.error_author = "Tác giả không được để trống";
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
      this.bookTitle.genres = this.selectedGenre;
      this.dauSach.updateBookTitle(this.bookTitle).subscribe((response) => {
        if (response.status === CommonConstant.RESULT_OK) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Sửa đầu sách thành công",
          }).then(() => {
            if (this.filesAdd) {
              const formData = new FormData();
              this.filesAdd.forEach((file: File) => {
                formData.append("files", file);
              });
              formData.append("bookCode", this.id);

              this.dauSach.addCover(formData, this.imageDelete).subscribe();
            }
            this.router.navigate(["/sys/list-dausach"]);
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Sách cùng tên đã tồn tại trong hệ thống",
          });
        }
      });
    }
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.filesAdd.unshift(event.target.files[0]);

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
            idImage: 0,
          });
          this.imageObject.unshift({
            image: event.target!.result as string,
            thumbImage: event.target!.result as string,
            idImage: 0,
          });
        }
      };
    }
    console.log("files", this.filesAdd);

    // hiển thị ảnh ở ảnh to nhất
    // this.file = event.target.files[0];
  }
  enableBook(bookId: any) {
    Swal.fire({
      icon: "info",
      title: "Xác nhận",
      text: "Bạn có muốn kích hoạt quyển sách này không?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dauSach.changeStatus(1, bookId).subscribe((response) => {
          if (response.status === CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Kích hoạt sách thành công",
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Có lỗi trong việc kích hoạt sách",
            });
          }
        });
      }
    });
  }

  disableBook(bookId: any) {
    Swal.fire({
      icon: "info",
      title: "Xác nhận",
      text: "Bạn có muốn vô hiệu hóa quyển sách này không?",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        this.dauSach.changeStatus(0, bookId).subscribe((response) => {
          if (response.status === CommonConstant.RESULT_OK) {
            Swal.fire({
              icon: "success",
              title: "Thành công",
              text: "Vô hiệu hóa sách thành công",
            }).then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Có lỗi trong việc vô hiệu hóa sách",
            });
          }
        });
      }
    });
  }
  removeImage() {
    //lưu những ảnh bị xoá
    if (this.imageObject[this.indexCurrentImageShow]) {
      this.imageDelete.push(
        this.imageObject[this.indexCurrentImageShow].idImage + ""
      );
      console.log("deleted");
    }
    //xoá ảnh đó trong imageObject
    this.imageObject.splice(this.indexCurrentImageShow, 1);
    //thêm vào fileAđ
    this.filesAdd.splice(this.indexCurrentImageShow, 1);

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
        idImage: this.imageObject[this.indexCurrentImageShow].idImage,
      });
    } else {
      let imageSrc = this.fileService.getImages("no-image.png");
      if (imageSrc) {
        this.imageObjectPreview = [];
        this.imageObjectPreview.unshift({
          image: imageSrc,
          thumbImage: imageSrc,
          idImage: this.imageObject[this.indexCurrentImageShow].idImage,
        });
      }
    }

    console.log("files", this.filesAdd);
    console.log("delete", this.imageDelete);
  }

  imageClickHandler(e) {
    console.log("image click", e);
    this.imageObjectPreview = [];
    this.indexCurrentImageShow = e;
    this.imageObjectPreview.unshift({
      image: this.imageObject[e].image,
      thumbImage: this.imageObject[e].thumbImage,
      idImage: this.imageObject[e].idImage,
    });
  }
}
