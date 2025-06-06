import { Component, OnInit } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Colunas } from '../../../model/comuns/colunas';
import { DefaultRequestsService } from '../../../services/requests/default-requests.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmissorPaginacao } from '../../../model/comuns/emissorPaginacao';
import { ValidatorReunioes } from '../../../model/tela-reunioes/validatorReunioes';
import { Reunioes } from '../../../model/tela-reunioes/reunioes';
import { StepperModule } from 'primeng/stepper';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { format } from 'date-fns';
@Component({
  standalone: true,
  selector: 'app-reunioes-modal-formulario',
  templateUrl: './reunioes-modal-formulario.component.html',
  styleUrls: ['./reunioes-modal-formulario.component.scss'],
  imports: [
    DynamicDialogModule,
    InputTextModule,
    FloatLabelModule,
    FormsModule,
    ButtonModule,
    StepperModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
})
export class ReunioesModalFormularioComponent implements OnInit {
  dadosFormulario: Reunioes = {};
  ehCadastro: boolean = true;

  isDisable: boolean = false;

  descricaoValue: string;

  resolucaoTela: number;

  isResolucaoMobile: boolean = false;

  dataMinima: Date = new Date();

  admOptions: any[] =[];

  validador: ValidatorReunioes = {
    reuniaoId: true,
    reuniaoDescricao: true,
    reuniaoStatus: true,
    reuniaoAta: true,
    reuniaoData: true,
    reuniaoDataFim: true,
    reuniaoDataIni: true,
    admId: true
  };

  statusOptions: any[] = [
    { id: 'A', name: 'A - Aberta' },
    { id: 'F', name: 'F - Fechada' },
  ];

  dateInicial: string;

  dateFinal: string;

  dataMaximaFinal: any;

  dataMinimaFinal: any;

  selectedDataInicial: any;

  selectedDataFinal: any;

  dataMaximaInicial: any;

  descricaoAta: string;

  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private service: DefaultRequestsService,
  ) {}

  ngOnInit() {
    this.iniciaVariaveis();
    this.verificaResolucao();
    this.buscaDadosDropDown();
  }

  private iniciaVariaveis(): void {
    if (this.config.data != null) {
      this.dadosFormulario = this.config.data;
      this.ehCadastro = false;
      return;
    }

    this.isDisable = true;

    this.dadosFormulario.reuniaoStatus = 'A';
  }

  public salvarDados(): void {
    if (!this.verificaCampos()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Existem campos obrigatórios não preenchidos',
        life: 3000,
        key: 'toast-reunioes-formulario',
      });
      return;
    }
    this.preencheDadosFormulario();

    this.ref.close(this.dadosFormulario);
  }

  private preencheDadosFormulario(): void {
    this.dadosFormulario.reuniaoDataIni = format(this.dateInicial, 'dd/MM/yyyy HH:mm');
    this.dadosFormulario.reuniaoDataFim =  format(this.dateFinal, 'dd/MM/yyyy HH:mm');
    this.dadosFormulario.reuniaoAta = this.descricaoAta;
  }

  private verificaCampos(): boolean {
    let dadosValidos: boolean = true;

    if (
      this.dateInicial == null ||
      this.dateInicial == undefined ||
      this.dateInicial == ''
    ) {
      dadosValidos = false;
      this.validador.reuniaoDataIni = false;
    } else {
      this.validador.reuniaoDataFim = true;
    }

    if (
      this.dateFinal == null ||
      this.dateFinal == undefined ||
      this.dateFinal == ''
    ) {
      dadosValidos = false;
      this.validador.reuniaoDataFim = false;
    } else {
      this.validador.reuniaoDataFim = true;
    }

    if (
      this.dadosFormulario.reuniaoDescricao == null ||
      this.dadosFormulario.reuniaoDescricao == undefined ||
      this.dadosFormulario.reuniaoDescricao == ''
    ) {
      dadosValidos = false;
      this.validador.reuniaoDescricao = false;
    } else {
      this.validador.reuniaoDescricao = true;
    }

    if (
      this.descricaoAta == null ||
      this.descricaoAta == undefined ||
      this.descricaoAta == ''
    ) {
      dadosValidos = false;
      this.validador.reuniaoAta = false;
    } else {
      this.validador.reuniaoAta = true;
    }

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

  public sairModal(): void {
    this.ref.close(null);
  }

  public onDataInicialSelected() {
    this.dataMinimaFinal = this.dateInicial;
  }

  public onDataFinalSelected() {
    this.dataMaximaInicial = this.dateFinal;
  }

  public onClearDataFinal() {
    if (this.dateFinal == null) {
      this.dataMaximaInicial = new Date();
    }
  }

  public onClearDataInicial() {
    if (this.dateInicial == null) {
      this.dataMinimaFinal = null;
    }
  }

  private verificaResolucao() {
    this.resolucaoTela = window.innerWidth;

    if (this.resolucaoTela <= 720) {
      this.isResolucaoMobile = true;
    }
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
