import { Evaluation } from "./../../../_model/models/evaluation.model";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { lastValueFrom } from "rxjs";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DauSach } from "src/app/_model/models/book.model";
import { FileService } from "src/app/_service/comm/file.service";
import { User0105Service } from "src/app/_service/user/user0105.service";
import { ImageEditObject } from "../../bookTitle/editBookTitle/editBookTitle.component";

@Component({
  selector: "app-danh-gia",
  templateUrl: "./phieu-danh-gia.component.html",
  styleUrls: ["./phieu-danh-gia.component.css"],
})
export class PhieuDanhGiaComponent implements OnInit {
  @Input() book: DauSach;

  eval: Evaluation = {
    user_uid: "",
    evaluate_id: "",
    sachmuon_id: "",
    star: 1,
    date_evaluate: "",
    content: "",
  };

  files: File[] = [];
  images: ImageEditObject[] = [];
  imageDelete: string[] = [];

  public form: FormGroup;
  rating: number;

  constructor(
    public activeModal: NgbActiveModal,
    private user0105Service: User0105Service,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    // this.user0105Service.getEvaluateOfBook(this.book.sachMuon_id!).subscribe({
    //   next: (resp: DataResponse) => {
    //     if (resp.status == CommonConstant.RESULT_OK) {
    //       this.eval = resp.responseData as Evaluation;
    //       this.eval.images?.forEach((img) => {
    //         let src = this.fileService.getImages(img.path);
    //         img.imageSrc = src;
    //         this.images.unshift({
    //           image: src,
    //           thumbImage: src,
    //           idImage: img.id!,
    //         });
    //       });
    //     }
    //   },
    //   error: (err: any) => {},
    // });
  }

  onSelectFile(event) {
    // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      this.files.unshift(event.target.files[0]);
      // this.files.push(event.target.files[0]);

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        // this.previewImage = event.target!.result;
        if (event.target!.result !== null) {
          this.images.unshift({
            image: event.target!.result as string,
            thumbImage: event.target!.result as string,
            idImage: 0,
          });
        }
      };
    }
    // hiển thị ảnh ở ảnh to nhất
    // this.file = event.target.files[0];
  }

  removeFile(index: number) {
    //lưu những ảnh bị xoá
    this.imageDelete.push(this.images[index].idImage + "");
    //xoá ảnh đó trong images
    this.images.splice(index, 1);
    //xoas trong files
    this.files.splice(index, 1);
  }

  async onSave() {
    await this.saveContent();
  }

  async saveContent() {
    if (this.eval.evaluate_id === undefined) {
      this.eval.sachmuon_id = this.book.sachMuon_id;
      const resp = await lastValueFrom(this.user0105Service.insert(this.eval));

      if (resp.status == CommonConstant.RESULT_OK) {
        if (this.files) {
          const formData = new FormData();
          this.files.forEach((file: File) => {
            formData.append("files", file);
          });
          formData.append("evaluateId", resp.responseData);

          this.user0105Service.insertFiles(formData).subscribe();

          // Sau khi lưu dữ liệu thành công, đóng popup
          this.activeModal.close("Close click");
          this.toastr.success("Đánh giá  thành công!");
        }
      } else {
        this.toastr.error("Đánh giá không thành công!");
      }
    } else {
      this.eval.sachmuon_id = this.book.sachMuon_id;
      // const resp = await lastValueFrom(this.user0105Service.update(this.eval));
      const resp = await lastValueFrom(this.user0105Service.insert(this.eval));

      if (resp.status == CommonConstant.RESULT_OK) {
        if (this.files) {
          const formData = new FormData();
          this.files.forEach((file: File) => {
            formData.append("files", file);
          });
          formData.append("evaluateId", this.eval.evaluate_id);
          this.imageDelete.forEach((id: string) => {
            formData.append("imageDelete", id);
          });
          this.user0105Service.insertFiles(formData).subscribe();

          // Sau khi lưu dữ liệu thành công, đóng popup
          this.activeModal.close("Close click");

          this.toastr.success("Đánh giá  thành công!");
        }
      } else {
        this.toastr.error("Đánh giá không thành công!");
      }
    }
  }
}
