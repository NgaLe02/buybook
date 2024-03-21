import { EventEmitter, Injectable, Output } from "@angular/core";

@Injectable()
export class SearchService {
  dataEmitter = new EventEmitter<string>();

  statusOfPhieuMuonEmitter = new EventEmitter<number>();

  constructor() {}

  raiseDataEmitterEvent(data: string) {
    this.dataEmitter.emit(data);
  }

  raiseStatutEmitterEvent(data: number) {
    this.statusOfPhieuMuonEmitter.emit(data);
  }
}
