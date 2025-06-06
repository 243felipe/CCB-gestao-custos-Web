import { Component, OnInit } from '@angular/core';
import {
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DefaultRequestsService } from '../../../services/requests/default-requests.service';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { Administracao } from '../../../model/tela-administracao/administracao';
import { ValidatorAdministracao } from '../../../model/tela-administracao/validatorAdministracao';

@Component({
  selector: 'app-administracao-modal-formulario',
  templateUrl: './administracao-modal-formulario.component.html',
  styleUrls: ['./administracao-modal-formulario.component.scss'],
  standalone: true,
  imports: [
    DynamicDialogModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
  ],
})
export class AdministracaoModalFormularioComponent implements OnInit {
  dadosFormulario: Administracao = {};
  ehCadastro: boolean = true;

  isDisable: boolean = false;

  validador: ValidatorAdministracao = {
    admNome: true,
    admCidade: true,
    admEstado: true
  };

  admOptions: any[] = [];

  setorOptions: any[] = [];

  admSelecionada: number;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: DefaultRequestsService
  ) {}

  ngOnInit() {
    this.iniciaVariaveis();
  }

  private iniciaVariaveis(): void {
    if (this.config.data != null) {
      this.dadosFormulario = this.config.data;
      this.dadosFormulario.admNome = this.config.data.admNome;
      this.dadosFormulario.admEstado = this.config.data.admEstado;
      this.dadosFormulario.admCidade = this.config.data.admCidade;
      this.ehCadastro = false;
      this.isDisable = true;
    }
  }

  public salvarDados(): void {
    if (!this.verificaCampos()) {
      return;
    }
    this.ref.close(this.dadosFormulario);
  }

  private verificaCampos(): boolean {
    let dadosValidos: boolean = true;

    if (
      this.dadosFormulario.admNome == null ||
      this.dadosFormulario.admNome == undefined ||
      this.dadosFormulario.admNome == ''
    ) {
      dadosValidos = false;
      this.validador.admNome = false;
    } else {
      this.validador.admNome = true;
    }

    if (
      this.dadosFormulario.admCidade == null ||
      this.dadosFormulario.admCidade == undefined ||
      this.dadosFormulario.admCidade == ''
    ) {
      dadosValidos = false;
      this.validador.admCidade = false;
    } else {
      this.validador.admCidade = true;
    }

    if (
      this.dadosFormulario.admEstado == null ||
      this.dadosFormulario.admEstado == undefined ||
      this.dadosFormulario.admEstado == ''
    ) {
      dadosValidos = false;
      this.validador.admEstado = false;
    } else {
      this.validador.admEstado = true;
    }
    return dadosValidos;
  }

  public sairModal(): void {
    this.ref.close(null);
  }
}
