import { ValidatorCasaOracoes } from './../../../model/tela-casaOracoes/validatorCasaOracoes';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import {
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { CasaOracoes } from '../../../model/tela-casaOracoes/casaOracoes';
import { DefaultRequestsService } from '../../../services/requests/default-requests.service';

@Component({
  standalone: true,
  selector: 'app-casaOracoes-modal-formulario',
  templateUrl: './casaOracoes-modal-formulario.component.html',
  styleUrls: ['./casaOracoes-modal-formulario.component.scss'],
  imports: [
    DynamicDialogModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
  ],
})
export class CasaOracoesModalFormularioComponent implements OnInit {
  dadosFormulario: CasaOracoes = {};
  ehCadastro: boolean = true;

  isDisable: boolean = false;

  validador: ValidatorCasaOracoes = {
    igrId: true,
    igrCod: true,
    igrNome: true,
    admNome: true,
    setorNome: true,
    igrEstado: true,
    igrCidade: true,
    igrBairro: true,
    igrCep: true,
    igrEndereco: true,
    igrComplemento: true,
    admId: true,
    setorId: true,
  };

  admOptions: any[] = [];

  setorOptions: any[] =[];

  admSelecionada: number;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: DefaultRequestsService
  ) {}

  ngOnInit() {
    this.iniciaVariaveis();
    this.buscaDadosDropDownAdm();
    this.buscaDadosDropDownSetor();
  }

  private iniciaVariaveis(): void {
    if (this.config.data != null) {
      this.dadosFormulario = this.config.data;
      this.dadosFormulario.admNome = this.config.data.admNome;
      this.dadosFormulario.setorNome = this.config.data.setorNome;
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
      this.dadosFormulario.igrNome == null ||
      this.dadosFormulario.igrNome == undefined ||
      this.dadosFormulario.igrNome == ''
    ) {
      dadosValidos = false;
      this.validador.igrNome = false;
    } else {
      this.validador.igrNome = true;
    }

    if (
      this.dadosFormulario.admId == null ||
      this.dadosFormulario.admId == undefined ||
      this.dadosFormulario.admId == 0
    ) {
      dadosValidos = false;
      this.validador.admId = false;
    } else {
      this.validador.admId = true;
    }


    if (
      this.dadosFormulario.setorId == null ||
      this.dadosFormulario.setorId == undefined ||
      this.dadosFormulario.setorId == 0
    ) {
      dadosValidos = false;
      this.validador.setorId = false;
    } else {
      this.validador.setorId = true;
    }



    if (
      this.dadosFormulario.igrCod == null ||
      this.dadosFormulario.igrCod == undefined ||
      this.dadosFormulario.igrCod == ''
    ) {
      dadosValidos = false;
      this.validador.igrCod = false;
    } else {
      this.validador.igrCod = true;
    }


    if (
      this.dadosFormulario.igrEstado == null ||
      this.dadosFormulario.igrEstado == undefined ||
      this.dadosFormulario.igrEstado == ''
    ) {
      dadosValidos = false;
      this.validador.igrEstado = false;
    } else {
      this.validador.igrEstado = true;
    }


    if (
      this.dadosFormulario.igrCidade == null ||
      this.dadosFormulario.igrCidade == undefined ||
      this.dadosFormulario.igrCidade == ''
    ) {
      dadosValidos = false;
      this.validador.igrCidade = false;
    } else {
      this.validador.igrCidade = true;
    }


    if (
      this.dadosFormulario.igrBairro == null ||
      this.dadosFormulario.igrBairro == undefined ||
      this.dadosFormulario.igrBairro == ''
    ) {
      dadosValidos = false;
      this.validador.igrBairro = false;
    } else {
      this.validador.igrBairro = true;
    }

    if (
      this.dadosFormulario.igrCep == null ||
      this.dadosFormulario.igrCep == undefined ||
      this.dadosFormulario.igrCep == ''
    ) {
      dadosValidos = false;
      this.validador.igrCep = false;
    } else {
      this.validador.igrCep = true;
    }

    if (
      this.dadosFormulario.igrEndereco == null ||
      this.dadosFormulario.igrEndereco == undefined ||
      this.dadosFormulario.igrEndereco == ''
    ) {
      dadosValidos = false;
      this.validador.igrEndereco = false;
    } else {
      this.validador.igrEndereco = true;
    }
    return dadosValidos;
  }

  public sairModal(): void {
    this.ref.close(null);
  }

  private buscaDadosDropDownAdm(): void {
    if (this.ehCadastro) {
      this.service.defaultGet(this.constroiUrl('dropdowns/dropdown-adm?')).subscribe({
        next: (res) => {
          this.admOptions = res;
        },
        error: (err) => {},
      });
    }
  }

  private constroiUrl(urlFinal: string): string {
    let url = `/api-ccb/${urlFinal}`;
    return url;
  }

  private buscaDadosDropDownSetor(): void {
    if (this.ehCadastro) {
      this.service.defaultGet(this.constroiUrl('dropdowns/dropdown-setor?')).subscribe({
        next: (res) => {
          this.setorOptions = res;
        },
        error: (err) => {},
      });
    }
  }

}
