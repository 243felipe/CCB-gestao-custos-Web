import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-topo-breadcrumb',
  templateUrl: './topo-breadcrumb.component.html',
  styleUrls: ['./topo-breadcrumb.component.scss'],
  standalone: true,
  imports: [BreadcrumbModule, NgClass],
})
export class TopoBreadcrumbComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input() items;


}
