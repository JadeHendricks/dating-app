import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public registerMode: boolean = false;

  constructor() {}

  ngOnInit(): void {
  }

  public registerToggle(): void {
    this.registerMode = !this.registerMode;
  }
  
}
