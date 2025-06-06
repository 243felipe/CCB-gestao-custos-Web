import { TokenService } from './../../../services/token/token.service';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/services';
import { TopoPaginasComponent } from './topo-paginas/topo-paginas.component';
import { MenuComponent } from './menu/menu.component';
import { DefaultRequestsService } from '../../../services/requests/default-requests.service';
import { MenuItem, TreeNode } from 'primeng/api';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [],
  imports: [TopoPaginasComponent, MenuComponent, RouterOutlet]
})
export class DashboardComponent implements OnInit {

  sidebarVisible: boolean = false;
  menu: TreeNode[] = [];

  isMenuDashBoard: boolean = true;

  constructor(private tokenService: TokenService, private authService: AuthenticationService, private service: DefaultRequestsService,
    private router: Router) { }
  ngOnInit() {
    // this.tokenService.removeTempAuth();
    // this.tokenService.acessoTelas('acessoTelas');
    this.requisitaMenu();

    if (!this.tokenService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // this.abrirMenu(true);
  }

  private requisitaMenu(): void {
    this.service.defaultGet('/api/auth/menu-acesso/valida-visualizacao-menu').subscribe({
      next: (res) => {
        this.menu = res;
      },
      error: (err) => {
      },
    })
  }

  public abrirMenu(estadoBotao: boolean): void {
    this.sidebarVisible = estadoBotao;
  }

  public sairMenu(estadoBotao: boolean): void {
    this.sidebarVisible = estadoBotao;
  }

  public redirecionaRota(rota: string): void {
    console.log(rota);
    this.tokenService.setNavigatedFromMenu(true);
    this.router.navigate([rota]);
  }

}
