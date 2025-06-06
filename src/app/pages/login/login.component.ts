import { authGuard } from './../../services/guard/auth.guard';
import { AuthenticationService } from './../../services/services/authentication.service';
import { TokenService } from './../../services/token/token.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Router } from '@angular/router';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpTokenInterceptor } from '../../services/interceptor/http-token.interceptor';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import * as CryptoJS from 'crypto-js';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthGuardService } from '../../services/token/authGuard.service';
import { TopoPaginasComponent } from './dashboard/topo-paginas/topo-paginas.component';

@Component({
  imports: [
    FormsModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    PasswordModule,
    ProgressSpinnerModule,
    ToastModule,
    TopoPaginasComponent
  ],
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private authService: AuthenticationService,
    private authGuard: AuthGuardService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    localStorage.clear();
  }

  authRequest: AuthenticationRequest = { email: '', password: '' };

  email: string = '';

  senha: string = '';

  isEmailEmpty: boolean = false;

  isSenhaEmpty: boolean = false;

  spinnerActive: boolean = false;

  key: any;

  iv: any;

  isMenuDashBoard: boolean = false;

  togglePasswordVisibility(event: Event): void {
    const eyeIcon = event.target as HTMLElement;
    const passwordField = eyeIcon.previousElementSibling as HTMLInputElement;

    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      eyeIcon.classList.replace('bx-hide', 'bx-show');
    } else {
      passwordField.type = 'password';
      eyeIcon.classList.replace('bx-show', 'bx-hide');
    }
  }

  realizarLogin() {
    var isCampoPreenchido = this.isCampoPreenchido();
    if (!isCampoPreenchido) {
      return;
    }
    this.spinnerActive = true;
    this.loginRequest();
  }

  async loginRequest() {
    this.authRequest.email = this.email;
    this.authRequest.password = this.encryptToBase64(this.senha);

    try {
      const usuarioValido = await this.authService
        .validarUsuario(this.authRequest.email, this.authRequest.password)
        .toPromise();

      if (usuarioValido) {
        this.tokenService.setCameFromLogin(true);
        this.router.navigate(['/autenticar-codigo']);

        try {
         await this.authService
            .authenticate({
              body: this.authRequest,
            })
            .toPromise();
        } catch (err) {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error.message,
            key: 'autenticacao',
            life: 3000,
          });
        }
      }
    } catch (err) {
      this.spinnerActive = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: err.error.message,
        key: 'login',
        life: 3000,
      });
    }
  }

  //       this.spinnerActive = false;
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Erro',
  //         detail: err.error.message,
  //         key: 'login',
  //         life: 3000,
  //       });

  // Função para criptografar uma string para Base64 com AES
  encryptToBase64(str: string): string {
    this.key = CryptoJS.enc.Hex.parse('63686176655365637265743132333334'); // 16, 24, or 32 bytes
    this.iv = CryptoJS.enc.Hex.parse('64617461536563726574313233333435'); // 16 bytes

    let encrypted = CryptoJS.AES.encrypt(str, this.key, { iv: this.iv });
    return encrypted.toString(); // Retorna uma string Base64
  }

  isCampoPreenchido(): boolean {
    this.isEmailEmpty = false;
    this.isSenhaEmpty = false;

    if (this.email === '' && this.senha === '') {
      this.isEmailEmpty = true;
      this.isSenhaEmpty = true;
      return false;
    }

    if (this.email === '') {
      this.isEmailEmpty = true;
      return false;
    }

    if (this.senha === '') {
      this.isSenhaEmpty = true;
      return false;
    }

    return true;
  }
}
