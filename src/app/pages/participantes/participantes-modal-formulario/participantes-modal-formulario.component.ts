import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Participantes } from '../../../model/tela-participantes/participantes';
import { ValidatorParticipantes } from '../../../model/tela-participantes/validatorParticipantes';
import { DefaultRequestsService } from '../../../services/requests/default-requests.service';

@Component({
  standalone: true,
  selector: 'app-participantes-modal-formulario',
  templateUrl: './participantes-modal-formulario.component.html',
  styleUrls: ['./participantes-modal-formulario.component.scss'],
  imports: [
    DynamicDialogModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
  ],
})
export class ParticipantesModalFormularioComponent implements OnInit {
  dadosFormulario: Participantes = {};
  ehCadastro: boolean = true;

  isDisable: boolean = false;

  validador: ValidatorParticipantes = {
    cargoParticipante: true,
    comumParticipante: true,
    nomeParticipante: true,
    reuniaoId: true,
  };


  comumOptions: any[] = [];

  reuniaoOptions: any[] = [];


  admSelecionada: number;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private service: DefaultRequestsService
  ) {}

  ngOnInit() {
    this.iniciaVariaveis();
    this.buscaDadosDropDownComum();
    this.buscaDadosDropDownReuniao();
  }

  private iniciaVariaveis(): void {
    if (this.config.data != null) {
      this.dadosFormulario = this.config.data;

      console.log(this.config.data)
      // this.admOptions.push(
      //   this.constroiEditDropdown(
      //     this.config.data.admId,
      //     this.config.data.admNome
      //   )
      // );

      this.reuniaoOptions.push(this.constroiEditDropdownReuniao(this.config.data.reuniaoId, this.config.data.reuniaoDescricao));

      this.comumOptions.push(this.constroiEditDropdownComum(this.config.data.comumParticipante));

      this.dadosFormulario.reuniaoId = this.config.data.reuniaoId;
      this.dadosFormulario.comumParticipante = this.config.data.comumParticipante;

      this.ehCadastro = false;
      this.isDisable = true;
    }
  }

  private constroiEditDropdownReuniao(id: number, nome: string): object {
    let bodyDropDownOptions = {
      reuniaoId: id,
      nomeReuniao: nome,
    };
    return bodyDropDownOptions;
  }

  private constroiEditDropdownComum(id: string): object {
    let bodyDropDownOptions = {
      nomeComum: id,
    };
    return bodyDropDownOptions;
  }

  public salvarDados(): void {
    if (!this.verificaCampos()) {
      return;
    }
    this.ref.close(this.dadosFormulario);
  }

  private verificaCampos(): boolean {
    let dadosValidos: boolean = true;

    // if (
    //   this.dadosFormulario.setorNome == null ||
    //   this.dadosFormulario.setorNome == undefined ||
    //   this.dadosFormulario.setorNome == ''
    // ) {
    //   dadosValidos = false;
    //   this.validador.nomeSetor = false;
    // } else {
    //   this.validador.nomeSetor = true;
    // }

    // if (
    //   this.dadosFormulario.admId == null ||
    //   this.dadosFormulario.admId == undefined ||
    //   this.dadosFormulario.admId == 0
    // ) {
    //   dadosValidos = false;
    //   this.validador.nomeAdm = false;
    // } else {
    //   this.validador.nomeAdm = true;
    // }

    return dadosValidos;
  }

  public sairModal(): void {
    this.ref.close(null);
  }

  private buscaDadosDropDownComum(): void {
    if (this.ehCadastro) {
      this.service.defaultGet(this.constroiUrlComum()).subscribe({
        next: (res) => {
          this.comumOptions = res;
        },
        error: (err) => {},
      });
    }
  }

  private constroiUrlComum(): string {
    let url = '/api-ccb/cadastro-participantes/dropdown-comum?';
    return url;
  }



  private buscaDadosDropDownReuniao(): void {
    if (this.ehCadastro) {
      this.service.defaultGet(this.constroiUrlComumReuniao()).subscribe({
        next: (res) => {
          this.reuniaoOptions = res;
        },
        error: (err) => {},
      });
    }
  }

  private constroiUrlComumReuniao(): string {
    let url = '/api-ccb/cadastro-participantes/dropdown-reuniao?';
    return url;
  }


}
