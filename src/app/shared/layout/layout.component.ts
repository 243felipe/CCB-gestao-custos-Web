import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  imports:[RouterModule],
  standalone: true
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
