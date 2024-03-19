import { DauSach } from "./book.model";
import { phieumuonDto } from "./phieumuonDto.model";

export class Notifications {
   notification_id?: string;
   userUid?: String;
   isRead?: Boolean;
   about?: Number;
   //   0: sách có sẵn
   // 1: mượn phiếu thành công (đang chờ xác nhận)
   // 2: xác nhận thành công (đang mượn)
   // 3: trả (đã trả)
   // 4: hủy (hủy phiếu mượn)
   content?: String;
   id?: String;
   book?: DauSach;
   phieuMuon?: phieumuonDto;
}
