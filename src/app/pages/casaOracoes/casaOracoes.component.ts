import { Component, OnInit } from '@angular/core';
import { Colunas } from '../../model/comuns/colunas';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DefaultRequestsService } from '../../services/requests/default-requests.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CasaOracoesModalFormularioComponent } from './casaOracoes-modal-formulario/casaOracoes-modal-formulario.component';
import { CasaOracoes } from '../../model/tela-casaOracoes/casaOracoes';
import { EmissorPaginacao } from '../../model/comuns/emissorPaginacao';
import { TabelaComponent } from '../../shared/tabela/tabela.component';
import { DashboardComponent } from '../login/dashboard/dashboard.component';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { TopoBreadcrumbComponent } from '../../shared/topo-breadcrumb/topo-breadcrumb.component';

@Component({
  standalone: true,
  selector: 'app-casaOracoes',
  templateUrl: './casaOracoes.component.html',
  styleUrls: ['./casaOracoes.component.scss'],
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
  ],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class CasaOracoesComponent implements OnInit {
  dadosGrid: CasaOracoes[] = [];
  colunas: Colunas[] = [];
  dataKey: string = 'setorId';
  page: number = 0;
  size: number = 5;
  totalRegistros: number = 5;
  carregaTabela: boolean = false;
  ordenar: string = null;
  orientacao: number = null;
  ref: DynamicDialogRef;
  filtroDescricaoCasaOracoes: string = null;
  items: object[];
  filtroCodIgrejaCasaOracoes: string = null;

  constructor(
    public dialogService: DialogService,
    private service: DefaultRequestsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}
  ngOnInit() {
    this.iniciaTabela();
    this.inicializaBreadCrumb();
  }

  private inicializaBreadCrumb(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/dashboard' },
      { label: 'Cadastro' },
      { label: 'Casa de Orações', isPrincipal: true },
    ];
  }

  private iniciaTabela(): void {
    this.colunas = [
      { field: 'igrId', header: 'Id' },
      { field: 'igrCod', header: 'Cód. Igreja' },
      { field: 'igrNome', header: 'Nome da Igreja' },
      { field: 'admNome', header: 'Administração' },
      { field: 'setorNome', header: 'Setor' },
      { field: 'igrEstado', header: 'Estado' },
      { field: 'igrCidade', header: 'Cidade' },
      { field: 'igrBairro', header: 'Bairro' },
      { field: 'igrCep', header: 'CEP' },
      { field: 'igrEndereco', header: 'Endereço' },
      { field: 'igrComplemento', header: 'Complemento' },
      { field: 'acoes', header: 'Ações' },
    ];
    this.buscaDadosGrid();
  }

  private buscaDadosGrid(): void {
    this.carregaTabela = true;
    this.service.defaultGet(this.constroiUrl()).subscribe({
      next: (res) => {
        console.log(res);
        const resValue = res.items.map((item) => ({
          igrId: item.igrId,
          igrCod: item.igrCod,
          igrNome: item.igrNome,
          admNome: item.adm != undefined ? item.adm.admNome : item.admNome, // Incluindo admNome
          setorNome:
            item.setor != undefined ? item.setor.setorNome : item.setorNome,
          igrEstado: item.igrEstado,
          igrCidade: item.igrCidade,
          igrBairro: item.igrBairro,
          igrCep: item.igrCep,
          igrEndereco: item.igrEndereco,
          igrComplemento: item.igrComplemento,
          admId: item.adm != undefined ? item.adm.admId : item.admId,
          setorId: item.setor != undefined ? item.setor.setorId : item.setorId,
        }));

        this.dadosGrid = resValue;
        this.totalRegistros = res.totalRecords;
        this.carregaTabela = false;
      },
      error: (err) => {},
    });
  }

  private constroiUrl(): string {
    let url = '';

    url += '/api-ccb/casa-oracoes?';

    url += `page=${this.page + 1}&size=${this.size}`;

    if (
      this.filtroDescricaoCasaOracoes != '' &&
      this.filtroDescricaoCasaOracoes != null
    ) {
      url += `&nomeIgreja=${this.filtroDescricaoCasaOracoes}`;
    }

    if (
      this.filtroCodIgrejaCasaOracoes != '' &&
      this.filtroCodIgrejaCasaOracoes != null
    ) {
      url += `&codIgreja=${this.filtroCodIgrejaCasaOracoes}`;
    }

    if (
      this.ordenar != null &&
      this.ordenar != 'admNome' &&
      this.ordenar != 'setorNome'
    ) {
      url += `&valueOrderBY=${this.ordenar}&isOrderByAsc=${
        this.orientacao == 1 ? true : false
      }`;
      this.ordenar = null;
    }

    return url;
  }

  cadastraCasaOracao() {
    this.ref = this.dialogService.open(CasaOracoesModalFormularioComponent, {
      data: null,
      header: 'Cadastro de Casa de orações',
      width: window.innerWidth >= 1200 ? '50%' : '100%',
      height: window.innerWidth >= 720 ? '60%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
      contentStyle: {
        overflow: window.innerWidth >= 1600 ? 'initial' : ' ',
      },
    });
    this.ref.onClose.subscribe((data: CasaOracoes) => {
      if (data != null) {
        console.log(data);
        this.requisicaoCadastro(data);
      }
    });
  }

  private requisicaoCadastro(data: CasaOracoes): void {
    let body: any = {
      admId: data.admId,
      setorId: data.setorId,
      igrBairro: data.igrBairro,
      igrCidade: data.igrCidade,
      igrNome: data.igrNome,
      igrCep: data.igrCep,
      igrEndereco: data.igrEndereco,
      igrEstado: data.igrEstado,
      igrCod: data.igrCod,
      igrComplemento:
        data.igrComplemento != '' && data.igrComplemento != null
          ? data.igrComplemento
          : null,
    };

    this.service.defaultPost('/api-ccb/casa-oracoes', body).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Casa de Oração cadastrada com sucesso!',
          key: 'toast-casaOracao',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error.errorMessage,
          life: 3000,
          key: 'toast-casaOracao',
        });
      },
    });
  }

  removeItemTabela(data: CasaOracoes) {
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
          .defaultDelete(`/api-ccb/casa-oracoes?id=${data.igrId}`)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Casa de Oração deletada com sucesso!',
                key: 'toast-casaOracao',
              });
              this.buscaDadosGrid();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: err.error.errorMessage,
                life: 3000,
                key: 'toast-casaOracao',
              });
            },
          });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
      },
      key: 'dialog-casaOracao',
    });
  }

  editaTabela(data: CasaOracoes) {
    this.ref = this.dialogService.open(CasaOracoesModalFormularioComponent, {
      data: data,
      header: 'Editar Casa de oração',
      width: window.innerWidth >= 1200 ? '50%' : '100%',
      height: window.innerWidth >= 720 ? '50%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: CasaOracoes) => {
      if (data != null) {
        this.atualizaSetores(data);
      }
      this.buscaDadosGrid();
    });
  }

  private atualizaSetores(data: CasaOracoes) {
    this.service.defaultPut('/api-ccb/casa-oracoes', data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Casa de Oração atualizada com sucesso!',
          key: 'toast-casaOracao',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {},
    });
  }

  recebePaginacao(data: EmissorPaginacao) {
    this.page = data.page;
    this.size = data.size;
    this.ordenar = data.ordenar;
    this.orientacao = data.orientacao;

    if (this.orientacao != null) {
      this.filtroDescricaoCasaOracoes = null;
      this.filtroCodIgrejaCasaOracoes = null;
    }
    this.buscaDadosGrid();
  }

  pesquisarFiltro() {
    this.buscaDadosGrid();
  }
}
