import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../services/token/token.service';
import { Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.component.html',
  styleUrls: ['./teste.component.css'],
  standalone: true,
  imports: [DashboardComponent]
})
export class TesteComponent implements OnInit {

  constructor(private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
     // Verifique se a navegação foi feita pelo menu
    //  if (!this.tokenService.isAuthenticated() || !this.tokenService.getNavigatedFromMenu()) {
    //   this.router.navigate(['/dashboard']);
    // }
  }

}
