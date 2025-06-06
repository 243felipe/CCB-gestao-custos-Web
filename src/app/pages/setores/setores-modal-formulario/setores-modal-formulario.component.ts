import { Component, OnInit } from '@angular/core';
import {
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule, NgSelectOption } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Setores } from '../../../model/tela-setores/setores';
import { ValidatorSetores } from '../../../model/tela-setores/validatorSetores';
import { DropdownModule } from 'primeng/dropdown';
import { DefaultRequestsService } from '../../../services/requests/default-requests.service';
@Component({
  standalone: true,
  selector: 'app-setores-modal-formulario',
  templateUrl: './setores-modal-formulario.component.html',
  styleUrls: ['./setores-modal-formulario.component.scss'],
  imports: [
    DynamicDialogModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
  ],
})
export class SetoresModalFormularioComponent implements OnInit {
  dadosFormulario: Setores = {};
  ehCadastro: boolean = true;

  isDisable: boolean = false;

  validador: ValidatorSetores = {
    nomeSetor: true,
    nomeAdm: true,
  };

  admOptions: any[] = [];

  admSelecionada: number;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: DefaultRequestsService
  ) {}

  ngOnInit() {
    this.iniciaVariaveis();
    this.buscaDadosDropDown();
  }

  private iniciaVariaveis(): void {
    if (this.config.data != null) {
      this.dadosFormulario = this.config.data;

      this.dadosFormulario.admNome = this.config.data.admNome;

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
      this.dadosFormulario.setorNome == null ||
      this.dadosFormulario.setorNome == undefined ||
      this.dadosFormulario.setorNome == ''
    ) {
      dadosValidos = false;
      this.validador.nomeSetor = false;
    } else {
      this.validador.nomeSetor = true;
    }

    if (
      this.dadosFormulario.admId == null ||
      this.dadosFormulario.admId == undefined ||
      this.dadosFormulario.admId == 0
    ) {
      dadosValidos = false;
      this.validador.nomeAdm = false;
    } else {
      this.validador.nomeAdm = true;
    }

    return dadosValidos;
  }

  public sairModal(): void {
    this.ref.close(null);
  }

  private buscaDadosDropDown(): void {
    if (this.ehCadastro) {
      this.service.defaultGet(this.constroiUrl()).subscribe({
        next: (res) => {
          this.admOptions = res;
        },
        error: (err) => {},
      });
    }
  }

  private constroiUrl(): string {
    let url = '/api-ccb/dropdowns/dropdown-adm?';
    return url;
  }
}
