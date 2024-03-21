import { UserInfo } from "../auth/user-info";
import { ImageBook } from "./imageBook.model";

export class Evaluation {
  user_uid?: String;
  userInfo?: UserInfo;
  evaluate_id?: string;
  sachmuon_id?: string;
  star?: number;
  date_evaluate?: string;
  content?: string;
  images?: ImageBook[];
}
