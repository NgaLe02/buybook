import { User0101Service } from 'src/app/_service/user/user0101.service';
import { Component, ElementRef, OnInit, PipeTransform, ViewChild } from '@angular/core';
import { AuthConstant } from 'src/app/_constant/auth.constant';
import { CommonConstant } from 'src/app/_constant/common.constants';
import { AuthenticationService } from 'src/app/_service/auth/authentication.service';
import { LoaderService } from 'src/app/_service/comm/loader.service';
import { DauSachService } from 'src/app/_service/services/dausach.service';
import { Cookie } from 'ng2-cookies';
import { DauSach } from 'src/app/_model/models/book.model';
import Swal from 'sweetalert2'
import { phieumuonDto } from 'src/app/_model/models/phieumuonDto.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { forkJoin } from 'rxjs';
import _ from 'lodash';
import { User0201Service } from 'src/app/_service/user/phieumuon/user0201.service';
import { FileService } from 'src/app/_service/comm/file.service';

@Component({
    selector: 'checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    formattedDate: string;
    bookCodeList: string[] = [];
    bookList: DauSach[] = [];
    bookListUnavailable: DauSach[] = [];
    imageList: string[] = [];
    imageListUn: string[] = [];
    agreed: boolean = false;
    phieumuon: phieumuonDto;
    route: ActivatedRoute | null | undefined;
    min = new Date().toISOString().split('T')[0];
    borrowedDate: Date = new Date(new Date().setDate(new Date().getDate() + 3));;
    max;

    imageToShowActiveSrc: string[] = []
    imageToShowUnavailableSrc: string[] = []

    @ViewChild('borrowedDateInput', { static: true }) borrowedDateInput: ElementRef;

    ngAfterViewInit() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = String(today.getFullYear());
        this.formattedDate = `${yyyy}-${mm}-${dd}`;
        console.log("formateedDate", this.formattedDate)
    }

    constructor(
        private authen: AuthenticationService,
        private loading: LoaderService,
        private dauSachService: DauSachService,
        private user0201Service: User0201Service,
        private user0101Service: User0101Service,
        private router: Router,
        private fileService: FileService,
    ) { }


    ngOnInit(): void {
        if (Cookie.check(AuthConstant.ACCESS_TOKEN_KEY)) {
            this.loading.change(true)
            const historyState = history.state;
            console.log("historyState", historyState.data);
            const maxDate = new Date();
            maxDate.setTime(maxDate.getTime() + 14 * 24 * 60 * 60 * 1000);
            this.max = maxDate.toISOString().split('T')[0];
            if (historyState && historyState.data) {
                this.bookCodeList = historyState.data;
            }
            if (this.bookCodeList.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Hiện không có sách nào có thể mượn. Vui lòng chọn sách cần mượn ở màn hình chính',
                }).then(() => {
                    this.router.navigate(['/user/cart/'])
                });
            }
            error: (err: any) => {
                this.loading.change(false)
            }
            this.getList();
        }
    }

    onSubmit() {
        if (this.agreed === true) {
            var tmp: DauSach[] = [];
            for (let item of this.bookList) tmp.push(item);
            this.bookList = [];
            this.bookListUnavailable = [];
            this.imageList = [];
            this.imageListUn = [];
            this.imageToShowActiveSrc = []
            this.imageToShowUnavailableSrc = []
            console.log(this.bookList);
            let subscribeList: any[] = [];
            for (let i = 0; i < this.bookCodeList.length; i++) {
                subscribeList.push(this.dauSachService.getBookAvailable(this.bookCodeList[i]));
            }
            forkJoin(subscribeList).subscribe((responseArray) => {
                console.log(responseArray);
                const sachList: any[] = [];
                const sachList2: any[] = [];
                for (let i = 0; i < responseArray.length; i++) {
                    if (responseArray[i].responseData == '1') {
                        sachList.push(this.dauSachService.getBookTitleDetail(this.bookCodeList[i]));
                    }
                    else {
                        sachList2.push(this.dauSachService.getBookTitleDetail(this.bookCodeList[i]));
                    }
                }
                if (sachList.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: 'Tất cả sách bạn chọn hiện đã tạm hết!',
                    });
                    forkJoin(sachList2).subscribe(
                        (response) => {
                            for (let item of response) this.bookListUnavailable.push(item.responseData);
                        }
                    );
                }
                else forkJoin(sachList)
                    .pipe(
                        map((response) => {
                            console.log(response);
                            console.log(tmp);
                            const listTmp: DauSach[] = [];
                            for (let i = 0; i < response.length; i++) {
                                listTmp.push(response[i].responseData);
                            }
                            console.log(listTmp);
                            console.log(_.isEqual(tmp, listTmp));
                            if (_.isEqual(tmp, listTmp)) {
                                this.phieumuon = {
                                    createdDate: new Date(),
                                    borrowDate: new Date(),
                                    status: 0,
                                    extended_times: 0,
                                    listBook: listTmp,
                                    fine: 0
                                };
                                console.log(this.phieumuon.listBook);
                                if (this.borrowedDate) this.phieumuon.borrowDate = this.borrowedDate;
                                else this.phieumuon.borrowDate?.setDate(this.phieumuon.borrowDate.getDate() + 3);
                                this.user0201Service.addPhieuMuon(listTmp, this.phieumuon).subscribe(
                                    (response) => {
                                        console.log('Response:', response);
                                        if (response.status == CommonConstant.RESULT_WN) {
                                            this.authen.logIn();
                                        }
                                        if (response.status === CommonConstant.RESULT_OK) {
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Thành công',
                                                text: 'Mượn sách thành công',
                                            }).then(() => {
                                                for (let item of listTmp) {
                                                    var book: DauSach = new DauSach();
                                                    book.bookCode = item.bookCode;
                                                    this.user0101Service.delete(book).subscribe(
                                                        (response) => {
                                                            if (response.status === CommonConstant.RESULT_NG) {
                                                                console.log(response);
                                                            }
                                                        }
                                                    )
                                                }
                                                this.router.navigate(['/user/phieumuon/status/0']).then(() => {

                                                });
                                            });
                                        }
                                        else if (response.status === CommonConstant.RESULT_NG) {
                                            Swal.fire({
                                                icon: 'error',
                                                title: 'Oops...',
                                                text: response.message,
                                            });
                                        }
                                    },
                                    (error) => {
                                        console.error('Error:', error);
                                    }
                                );
                            }
                            else {
                                listTmp.forEach(val => this.bookList.push(Object.assign({}, val)));
                                for (let item of this.bookList) {
                                    for(let img of item.images){
                                        if(img.about === 0){
                                            this.imageToShowActiveSrc.push(this.fileService.getImages(img.path))
                                            break
                                        }
                                    }
                                }
                                forkJoin(sachList2).pipe(
                                    map((response) => {
                                        response.forEach(val => this.bookListUnavailable.push(Object.assign({}, val.responseData)));
                                        // console.log(this.bookListUnavailable);
                                        for (let item of this.bookListUnavailable) {
                                            for (let item of this.bookListUnavailable) {
                                                for(let img of item.images){
                                                    if(img.about === 0){
                                                        this.imageToShowUnavailableSrc.push(this.fileService.getImages(img.path))
                                                        break
                                                    }
                                            }
                                        }
                                        }
                                    }
                                    )
                                ).subscribe();
                                Swal.fire({
                                    icon: 'info',
                                    title: 'Oops...',
                                    text: 'Danh sách sách đã cập nhật, vui lòng kiểm tra lại',
                                });
                            }
                        })
                    )
                    .subscribe();
            }
            );
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Bạn cần đồng ý với điều khoản!',
            });
        }
    }

    getList() {

        const subscribeList: any[] = [];
        this.imageToShowActiveSrc = []
        this.imageToShowUnavailableSrc = []
        for (let i = 0; i < this.bookCodeList.length; i++) {
            subscribeList.push(this.dauSachService.getBookAvailable(this.bookCodeList[i]));
        }
        forkJoin(subscribeList).subscribe((responseArray) => {
            // console.log(responseArray);
            const sachList: any[] = [];
            const sachList2: any[] = [];
            for (let i = 0; i < responseArray.length; i++) {
                if (responseArray[i].responseData == '1') {
                    sachList.push(this.dauSachService.getBookTitleDetail(this.bookCodeList[i]));
                }
                else {
                    sachList2.push(this.dauSachService.getBookTitleDetail(this.bookCodeList[i]));
                }
            }
            console.log("SACHLIST", sachList)
            if (sachList.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Oops...',
                    text: 'Tất cả sách bạn chọn hiện đã tạm hết!',
                });
            }
            else {
                forkJoin(sachList).pipe(
                    map((response) => {
                        for (let item of response) this.bookList.push(item.responseData);
                        for (let item of this.bookList) {
                            for(let img of item.images){
                                if(img.about === 0){
                                    this.imageToShowActiveSrc.push(this.fileService.getImages(img.path))
                                    break
                                }
                            }
                        }
                    console.log("bookList", this.bookList)

                    })
                ).subscribe()
            }
            forkJoin(sachList2).subscribe(
                (response) => {
                    for (let item of response) this.bookListUnavailable.push(item.responseData);
                    for (let item of this.bookListUnavailable) {
                            for(let img of item.images){
                                if(img.about === 0){
                                    this.imageToShowUnavailableSrc.push(this.fileService.getImages(img.path))
                                    break
                                }
                        }
                    }
                
                }
            )
        })
    }
}