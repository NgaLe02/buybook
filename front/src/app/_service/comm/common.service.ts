import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable()
export class SearchService {

  dataEmitter = new EventEmitter<string>();

  statusUserListEmittter = new EventEmitter<string>();

  statusOfPhieuMuonEmitter = new EventEmitter<number>();

  raiseDataEmitterEvent(data: string) {
    this.dataEmitter.emit(data);
  }

  raiseStatusUserListEmiiterEvent(data: string) {
    this.statusUserListEmittter.emit(data);
  }

  constructor() { }

  raiseStatutEmitterEvent(data: number) {
    this.statusOfPhieuMuonEmitter.emit(data);
  }
}
