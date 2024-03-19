import { Component, OnInit } from '@angular/core';
import { SseService } from 'src/app/_service/comm/sse.service';
import { User0104Service } from 'src/app/_service/user/user0104.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  constructor(

  ) { }


  ngOnInit(): void {

  }

}
