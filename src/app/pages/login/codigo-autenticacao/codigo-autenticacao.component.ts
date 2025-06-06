import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CodeInputModule } from 'angular-code-input';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { NgClass } from '@angular/common';
import { AuthenticationService } from '../../../services/services';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TokenService } from '../../../services/token/token.service';
import { TopoPaginasComponent } from '../dashboard/topo-paginas/topo-paginas.component';




@Component({
  standalone: true,
  imports: [InputTextModule, FormsModule,
            CodeInputModule, ButtonModule,
            TooltipModule, NgClass, ToastModule, TopoPaginasComponent],
  selector: 'app-codigo-autenticacao',
  templateUrl: './codigo-autenticacao.component.html',
  styleUrls: ['./codigo-autenticacao.component.scss'],
  providers: [MessageService
  ]
})
export class CodigoAutenticacaoComponent implements OnInit {
  constructor(private router: Router, private authService: AuthenticationService,   private messageService: MessageService,
    private tokenService: TokenService) {}
  value: any[] = [];

  codigoAutenticador: string = '';

  codigoNaoCompleto: boolean = false;

  isLoading: boolean = false;

  isDisable: boolean = false;

  isCodigoInvalido: boolean = false;

  notCompleteValue: boolean = true;

  completeValue: boolean = false;

  isMenuDashBoard: boolean = false;


  ngOnInit() {

    if (!this.tokenService.getCameFromLogin()) {
      this.router.navigate(['/']);
    }
  }

  public autenticarCodigo() {
    if (this.codigoAutenticador.length < 6){
      this.codigoNaoCompleto = true
      return;
    }
    this.codigoNaoCompleto = false;

    this.isLoading = true;

    this.isDisable = true;

    this.isCodigoInvalido = false;

    this.verificarCodigoRequest(this.codigoAutenticador);
    //if status retorna 200 vai para o dashboard caso contrario vai ser lançado uma mensagem de erro

  }

  onCodeChanged(event: string) {
    this.codigoAutenticador = '';
    this.codigoAutenticador = event;

    if (this.codigoAutenticador.length === 6){
      this.notCompleteValue = false;
      this.completeValue = true;
    }
  }
  onCodeCompleted(event: string) {
    this.codigoAutenticador = '';
    this.codigoAutenticador = event;
    console.log(this.codigoAutenticador);
  }


  retornarTelaLogin(){
    this.router.navigate([''])
  }

  verificarCodigoRequest(codigo: string) {
    this.authService.confirm({
      codigo
    })
      .subscribe({
        next: (res) => {
          this.tokenService.setToken(res.access_token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
            this.messageService.add({  severity: 'error', summary: 'Erro', detail: err.error.message, key: 'autenticacao', life: 3000 });
            this.isLoading = false;
            this.isDisable = false;
            this.isCodigoInvalido = true;
        },
      });

    }
}
