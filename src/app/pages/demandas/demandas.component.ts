import { Component, OnInit } from '@angular/core';
import { TopoBreadcrumbComponent } from '../../shared/topo-breadcrumb/topo-breadcrumb.component';
import { DashboardComponent } from '../login/dashboard/dashboard.component';

@Component({
  selector: 'app-demandas',
  templateUrl: './demandas.component.html',
  styleUrls: ['./demandas.component.scss'],
  standalone: true,
  imports: [TopoBreadcrumbComponent, DashboardComponent],
})
export class DemandasComponent implements OnInit {
  items: object[];

  constructor() {}

  ngOnInit() {
    this.inicializaBreadCrumb();
  }

  private inicializaBreadCrumb(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/dashboard' },
      { label: 'Cadastro' },
      { label: 'Demandas', isPrincipal: true },
    ];
  }
}
