import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})

//we can get access to navigationExtras from our route as per the interceptor (in the constructor)
export class ServerErrorComponent implements OnInit {

  error: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras?.state?.['error']
  }

  ngOnInit(): void {
  }
}
