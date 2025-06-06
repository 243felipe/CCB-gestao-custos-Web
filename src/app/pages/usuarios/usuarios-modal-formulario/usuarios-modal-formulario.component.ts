import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { StepperModule } from 'primeng/stepper';
import { Usuarios } from '../../../model/tela-usuarios/usuarios';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DropdownModule } from 'primeng/dropdown';
import { DefaultRequestsService } from '../../../services/requests/default-requests.service';
import { ValidatorUsuarios } from '../../../model/tela-usuarios/validatorUsuarios';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-usuarios-modal-formulario',
  templateUrl: './usuarios-modal-formulario.component.html',
  styleUrls: ['./usuarios-modal-formulario.component.scss'],
  standalone: true,
  imports: [
    StepperModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    NgClass,
    FormsModule,
    PasswordModule,
    ButtonModule,
    FloatLabelModule,
    DropdownModule,
  ],
})
export class UsuariosModalFormularioComponent implements OnInit {
  constructor(
    private service: DefaultRequestsService,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {
    this.admSelecionado = 'S';
    this.buscaDadosDropDownAdm();
  }

  isDisable: boolean = false;

  dadosFormulario: Usuarios = {};

  active: number | undefined = 0;

  admOptions: any[] = [];

  setorOptions: any[] = [];

  comumOptions: any[] = [];

  totalSetorSelecionado: string;

  admSelecionado: string;

  password: string;
  isPasswordValid: boolean = true;

  isAdmOptions: any[] = [
    { id: 'S', name: 'Sim' },
    { id: 'N', name: 'Não' },
  ];

  isTotalSetorOptions: any[] = [
    { id: 'S', name: 'Sim' },
    { id: 'N', name: 'Não' },
  ];

  validador: ValidatorUsuarios = {
    admId: true,
    emailUsuario: true,
    idUsuario: true,
    igrId: true,
    nomeAdm: true,
    nomeStor: true,
    nomeUsuario: true,
    setorId: true,
    senha: true,
  };

  private buscaDadosDropDownAdm(): void {
    this.service
      .defaultGet(this.constroiUrl('setores/dropdown-adm?'))
      .subscribe({
        next: (res) => {
          this.admOptions = res;
        },
        error: (err) => {},
      });
  }

  private constroiUrl(urlFinal: string): string {
    let url = `/api-ccb/${urlFinal}`;

    if (this.dadosFormulario.admId != null) {
      url += `admId=${this.dadosFormulario.admId}`;
    }

    return url;
  }

  private constroiUrlCasaOracao(urlFinal: string): string {
    let url = `/api-ccb/${urlFinal}`;

    if (this.dadosFormulario.admId != null) {
      url += `admId=${this.dadosFormulario.admId}`;
    }

    if (this.dadosFormulario.setorId != null) {
      url += `&setorId=${this.dadosFormulario.setorId}`;
    }

    return url;
  }

  buscaDadosDropDownSetor(): void {
    this.setorOptions = [];

    this.service.defaultGet(this.constroiUrl('dropdowns/setor?')).subscribe({
      next: (res) => {
        this.setorOptions = res;
      },
      error: (err) => {},
    });
  }

  private buscaDadosDropDownComum(): void {
    this.comumOptions = [];

    this.service
      .defaultGet(this.constroiUrlCasaOracao('dropdowns/casa-de-oracao?'))
      .subscribe({
        next: (res) => {
          this.comumOptions = res;
        },
        error: (err) => {},
      });
  }

  verificaTotalSetor() {
    if (
      this.totalSetorSelecionado == 'N' &&
      this.dadosFormulario.setorId != undefined &&
      this.dadosFormulario.setorId != null
    ) {
      this.buscaDadosDropDownComum();
    }
  }

  onChangeSetor() {
    if (
      this.dadosFormulario.setorId != undefined &&
      this.dadosFormulario.setorId != null
    ) {
      this.buscaDadosDropDownComum();
    }
  }

  voltarTelaSetorParaTelaAdm(prevCallback: any) {
    this.totalSetorSelecionado = null;
    this.dadosFormulario.setorId = null;
    this.dadosFormulario.igrId = null;

    prevCallback.emit();
  }

  avancarParaTelaAdm(nextCallback: any) {
    if (this.isPasswordValid) {
      nextCallback.emit();
    }
  }

  validatePassword(password: string) {
    // Função para validar a força da senha
    this.isPasswordValid = this.checkPasswordStrength(password);
  }

  checkPasswordStrength(password: string): boolean {
    // Defina os critérios de força da senha
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    // Verifique se todos os critérios são atendidos
    return (
      password.length >= minLength && hasUppercase && hasLowercase && hasNumber
    );
  }

  public salvarDadosPorSetor(): void {
    if (!this.verificaCamposSetor()) {
      return;
    }
    this.dadosFormulario.idPerfil = this.admSelecionado == 'S' ? 1 : 2;
    this.ref.close(this.dadosFormulario);
  }

  public salvarDadosPorAdm(): void {
    if (!this.verificaCamposAdm()) {
      return;
    }

    this.admSelecionado;
    this.dadosFormulario.idPerfil = this.admSelecionado == 'S' ? 1 : 2;
    this.ref.close(this.dadosFormulario);
  }

  private verificaCamposAdm(): boolean {
    let dadosValidos: boolean = true;

    if (
      this.dadosFormulario.admId == null ||
      this.dadosFormulario.admId == undefined
    ) {
      dadosValidos = false;
      this.validador.admId = false;
    } else {
      this.validador.admId = true;
    }

    return dadosValidos;
  }

  private verificaCamposSetor(): boolean {
    let dadosValidos: boolean = true;

    if (
      this.dadosFormulario.setorId == null ||
      this.dadosFormulario.setorId == undefined
    ) {
      dadosValidos = false;
      this.validador.setorId = false;
    } else {
      this.validador.setorId = true;
    }

    if (this.totalSetorSelecionado === 'N') {
      if (
        this.dadosFormulario.igrId == null ||
        this.dadosFormulario.igrId == undefined
      ) {
        dadosValidos = false;
        this.validador.igrId = false;
      } else {
        this.validador.igrId = true;
      }
    }

    return dadosValidos;
  }

  cancelarCadastro() {
    this.ref.close();
  }
}
