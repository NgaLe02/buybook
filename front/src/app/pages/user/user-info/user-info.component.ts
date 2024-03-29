import { Component, OnInit } from "@angular/core";
import { AuthConstant } from "src/app/_constant/auth.constant";
import { CommonConstant } from "src/app/_constant/common.constants";
import { UserInfo } from "src/app/_model/auth/user-info";
import { DataResponse } from "src/app/_model/resp/data-response";
import { AuthenticationService } from "src/app/_service/auth/authentication.service";
import { LoaderService } from "src/app/_service/comm/loader.service";
import { Cookie } from "ng2-cookies";
import { ToastrService } from "ngx-toastr";
import { FileService } from "src/app/_service/comm/file.service";

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.css"],
})
export class UserInfoComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private loading: LoaderService,
    private toastr: ToastrService,
    private fileService: FileService
  ) {}

  userInfo = new UserInfo();
  dob: string;
  previewImage: any;
  file: File;

  ngOnInit(): void {
    if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
      this.loading.change(true);
      this.authService.getUserInfo().subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            this.userInfo = resp.responseData;

            if (this.userInfo.dob) {
              const dateObj = new Date(this.userInfo.dob);
              dateObj.setDate(dateObj.getDate() + 1);
              this.dob = dateObj.toISOString().substring(0, 10);
            }

            if (this.userInfo.imgPath !== "") {
              this.previewImage = this.fileService.getFile(
                this.userInfo.imgPath
              );
            } else {
              this.previewImage = this.fileService.getFile("no-image.png");
            }
          } else {
          }
          this.loading.change(false);
        },
        error: (err: any) => {
          this.loading.change(false);
        },
      });
    }
  }

  error_email: string = "";
  error_phone: string = "";
  error_fullname: string = "";
  error_username: string = "";
  error_address: string = "";

  update() {
    let isValidate = true;

    if (this.userInfo.fullName && this.userInfo.fullName?.length > 255) {
      this.error_fullname = "Số lượng kí tự giới hạn là 255";
      isValidate = false;
    } else {
      this.error_fullname = "";
    }

    if (this.userInfo.userId && this.userInfo.userId?.length > 255) {
      this.error_username = "Số lượng kí tự giới hạn là 45";
      isValidate = false;
    } else {
      this.error_username = "";
    }

    if (this.userInfo.email === "" || this.userInfo.email === undefined) {
      this.error_email = "Email không được để trống";
      isValidate = false;
    } else if (
      this.userInfo.email &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        this.userInfo.email
      )
    ) {
      this.error_email = "Email không hợp lệ";
      isValidate = false;
    } else {
      this.error_email = "";
      // isValidate = true
    }
    if (this.userInfo.cellPhone === "") {
      this.error_phone = "Số điện thoại không được để trống";
      isValidate = false;
    } else if (
      this.userInfo.cellPhone?.length != 10 ||
      /\D/.test(this.userInfo.cellPhone)
    ) {
      this.error_phone = "Số điện thoại không hợp lệ";
      isValidate = false;
    } else {
      this.error_phone = "";
      // isValidate = true
    }

    if (this.userInfo.address && this.userInfo.address?.length > 255) {
      this.error_address = "Số lượng kí tự giới hạn là 45";
      isValidate = false;
    } else {
      this.error_address = "";
    }

    if (isValidate) {
      this.loading.change(true);
      this.userInfo.dob = new Date(this.dob);
      this.authService.updateUserInfo(this.userInfo).subscribe({
        next: (resp: DataResponse) => {
          if (resp.status == CommonConstant.RESULT_OK) {
            this.toastr.success("Cập nhật thông tin thành công");
            this.error_email = "";
            this.error_phone = "";
          } else {
            this.toastr.error("Cập nhật thông tin thất bại");
          }
          if (this.file) {
            const formData = new FormData();
            formData.append("file", this.file);
            this.authService.addUserCover(formData).subscribe();
          }
          this.loading.change(false);
          // this.router.navigateByUrl("/user/userInfo")
        },
        error: (err: any) => {
          this.loading.change(false);
          this.toastr.error("Cập nhật thông tin thất bại");
          // this.router.navigateByUrl("/user/userInfo")
        },
      });
    }
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.previewImage = event.target!.result;
      };
    }
    this.file = event.target.files[0];
  }
}
