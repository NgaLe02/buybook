import { Evaluation } from "./../../../_model/models/evaluation.model";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { CommonConstant } from "src/app/_constant/common.constants";
import { DauSach } from "src/app/_model/models/book.model";
import { DataResponse } from "src/app/_model/resp/data-response";
import { User0105Service } from "src/app/_service/user/user0105.service";

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
    date_add: "",
    content: "",
  };

  files: File[] = [];
  images: string[] = [];

  public form: FormGroup;
  rating: number;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private user0105Service: User0105Service,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.eval.star = 1;
    // this.form = this.fb.group({
    //   rating: ["", Validators.required],
    // });  }
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
          this.images.push(event.target!.result as string);
        }
      };
    }
    // hiển thị ảnh ở ảnh to nhất
    // this.file = event.target.files[0];
  }

  onSave() {
    this.eval.sachmuon_id = this.book.sachMuon_id;
    this.user0105Service.insert(this.eval).subscribe({
      next: (resp: DataResponse) => {
        if (resp.status == CommonConstant.RESULT_OK) {
          this.toastr.success("Đánh giá thành công!");
        } else {
          this.toastr.error("Đánh giá không thành công!");
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
