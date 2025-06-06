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
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { Colunas } from '../../model/comuns/colunas';
import { DefaultRequestsService } from '../../services/requests/default-requests.service';
import { EmissorPaginacao } from '../../model/comuns/emissorPaginacao';
import { ReunioesModalFormularioComponent } from './reunioes-modal-formulario/reunioes-modal-formulario.component';
import { DashboardComponent } from '../login/dashboard/dashboard.component';
import { TopoBreadcrumbComponent } from '../../shared/topo-breadcrumb/topo-breadcrumb.component';
import { TabelaComponent } from '../../shared/tabela/tabela.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { Reunioes } from '../../model/tela-reunioes/reunioes';
import { CalendarModule } from 'primeng/calendar';
import { CalendarTraducaoService } from '../../services/utils/calendar-traducao.service';
import { format } from 'date-fns';
import { ReunioesModalFiltroComponent } from './reunioes-modal-filtro/reunioes-modal-filtro.component';

@Component({
  standalone: true,
  selector: 'app-reuinioes',
  templateUrl: './reuinioes.component.html',
  styleUrls: ['./reuinioes.component.scss'],
  imports: [
    TabelaComponent,
    DashboardComponent,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    DynamicDialogModule,
    FloatLabelModule,
    FormsModule,
    TopoBreadcrumbComponent,
    CalendarModule,
  ],
  providers: [
    ConfirmationService,
    MessageService,
    DialogService,
    CalendarTraducaoService,
  ],
})
export class ReuinioesComponent implements OnInit {
  dadosGrid: Reunioes[] = [];

  colunas: Colunas[] = [];

  dataKey: string = 'idPrioridade';

  page: number = 0;

  size: number = 5;

  totalRegistros: number = 5;

  carregaTabela: boolean = false;

  ordenar: string = null;

  orientacao: number = null;

  ref: DynamicDialogRef;

  filtroDescricaoReuniao: string = null;

  items: object[];

  dateInicial: string = null;

  dateFinal: string = null;

  dataMaximaFinal: any;

  dataMinimaFinal: any;

  selectedDataInicial: any;

  selectedDataFinal: any;

  dataMaximaInicial: any;

  resolucaoTela: number;

  isResolucaoMobile: boolean = false;


  constructor(
    public dialogService: DialogService,
    private service: DefaultRequestsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private CalendarTraducaoService: CalendarTraducaoService // utiliza para traduzir calendarios
  ) {}

  ngOnInit() {
    this.iniciaTabela();
    this.inicializaBreadCrumb();
    this.verificaResolucao();
  }

  private inicializaBreadCrumb(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/dashboard' },
      { label: 'Cadastro' },
      { label: 'Reuniões', isPrincipal: true },
    ];
  }

  private iniciaTabela(): void {
    this.colunas = [
      { field: 'reuniaoId', header: 'Id' },
      { field: 'reuniaoDescricao', header: 'Descrição' },
      { field: 'reuniaoDataIni', header: 'Data Inicial' },
      { field: 'reuniaoDataFim', header: 'Data Final' },
      { field: 'reuniaoStatus', header: 'Status' },
      { field: 'acoes', header: 'Ações' },
    ];

    this.buscaDadosGrid();
  }

  private buscaDadosGrid(): void {
    this.carregaTabela = true;
    this.service.defaultGet(this.constroiUrl()).subscribe({
      next: (res) => {
        this.dadosGrid = res.items;
        this.totalRegistros = res.totalRecords;
        this.carregaTabela = false;
      },
      error: (err) => {},
    });
  }

  private constroiUrl(): string {
    let url = '/api-ccb/cadastro-reuniao?';

    url += `page=${this.page + 1}&size=${this.size}`;

    // terá filtro de data também
    if (this.filtroDescricaoReuniao != null && this.filtroDescricaoReuniao != '') {
      url += `&descricao=${this.filtroDescricaoReuniao}`;
    }

    if (this.dateInicial != null) {
      let dataInicial = format(this.dateInicial, 'dd/MM/yyyy');
      url += `&dataInicial=${dataInicial}`;
    }

    if (this.dateFinal != null) {
      let dataFinal = format(this.dateFinal, 'dd/MM/yyyy');
      url += `&dataFinal=${dataFinal}`;
    }

    if (this.ordenar != null) {
      url += `&valueOrderBY=${this.ordenar}&isOrderByAsc=${
        this.orientacao == 1 ? true : false
      }`;
      this.ordenar = null;
    }

    return url;
  }

  public recebePaginacao(data: EmissorPaginacao): void {
    this.page = data.page;
    this.size = data.size;
    this.ordenar = data.ordenar;
    this.orientacao = data.orientacao;

    if (this.orientacao != null) {
      this.limparFiltros();
    }
    this.buscaDadosGrid();
  }

  public editaTabela(data: Reunioes): void {
    // this.ref = this.dialogService.open(ReunioesModalFormularioComponent, {
    //   data: data,
    //   header: 'Editar Reunião',
    //   width: window.innerWidth >= 1200 ? '57%' : '100%',
    //   height: window.innerWidth >= 720 ? '63%' : '100%',
    //   styleClass: '',
    //   contentStyle :{
    //    overflow: 'initial'
    //   },
    //   baseZIndex: 10000,
    // });
    // this.ref.onClose.subscribe((data: Reunioes) => {
    //   if (data != null) {
    //     this.atualizaCategoria(data);
    //   }
    // });
  }


  public cadastraCategoria(): void {
    this.ref = this.dialogService.open(ReunioesModalFormularioComponent, {
      data: null,
      header: 'Cadastro Reunião',
      width: window.innerWidth >= 1200 ? '57%' : '100%',
      height: window.innerWidth >= 720 ? '66%' : '100%',
      styleClass: '',
      contentStyle :{
        overflow: 'initial'
       },
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Reunioes) => {
      if (data != null) {

        console.log(data);
        this.requisicaoCadastro(data);
      }
    });
  }

  public abrirModalFiltro(): void{
    this.ref = this.dialogService.open(ReunioesModalFiltroComponent,{
      data: null,
      header: 'Filtro Reunião',
      width: window.innerWidth >= 1200 ? '57%' : '100%',
      height: window.innerWidth >= 720 ? '66%' : '100%',
      styleClass: '',
      contentStyle :{
        overflow: 'initial'
       },
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: any )=>{
      if (data != null){
        this.dateInicial =  data.dataInicial;
        this.dateFinal = data.dataFinal;
        this.filtroDescricaoReuniao = data.filtroDescricao;
        // preencher os valores para filtrar
        this.buscaDadosGrid();
      }
    })
  }

  private requisicaoCadastro(data: Reunioes): void {
    let body: any = {
      reuniaoDescricao: data.reuniaoDescricao,
      reuniaoDataIni: data.reuniaoDataIni,
      reuniaoDataFim: data.reuniaoDataFim,
      reuniaoStatus: data.reuniaoStatus,
      reuniaoAta: data.reuniaoAta,
      admId: data.admId


    };

    console.log(body)
    this.service.defaultPost('/api-ccb/cadastro-reuniao', body).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Reunião cadastrada com sucesso!',
          key: 'toast-reunioes',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {},
    });
  }

  private atualizaCategoria(data: Reunioes): void {
    this.service.defaultPut('/api-ccb/cadastro-reuniao', data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Reunião atualizado com sucesso!',
          key: 'toast-reunioes',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {},
    });
  }

  public pesquisarFiltro(): void {
    this.ordenar = null;
    this.buscaDadosGrid();
  }

  public removeItemTabela(data: Reunioes): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que você quer remover?',
      header: 'Confirmação',
      icon: 'pi pi-info-circle',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-color',
      rejectButtonStyleClass: 'p-button-text color-padrao',
      accept: () => {
        this.service
          .defaultDelete(`/api-ccb/cadastro-reuniao?id=${data.reuniaoId}`)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Reunião deletada com sucesso!',
                key: 'toast-reunioes',
              });
              this.buscaDadosGrid();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: err.message,
                life: 3000,
                key: 'toast-reunioes',
              });
            },
          });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
      },
      key: 'dialog-reunioes',
    });
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

  private limparFiltros() {
    this.filtroDescricaoReuniao = null;
    this.dateInicial = null;
    this.dateFinal = null;
  }

  private verificaResolucao(){



    this.resolucaoTela = window.innerWidth;

    if (this.resolucaoTela <= 720){
       this.isResolucaoMobile = true;
    }
  }
}
