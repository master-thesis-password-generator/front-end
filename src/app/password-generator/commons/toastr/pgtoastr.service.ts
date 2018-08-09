import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class PGToastrService {

  constructor(private toastr: ToastrService) { }

  error(message: string, title: string) {
    this.toastr.error(message, title);
  }

  success(message: string, title: string) {
    this.toastr.success(message, title);
  }
}
