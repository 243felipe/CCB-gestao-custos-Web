import { Component, OnInit } from '@angular/core';
import { EmissorPaginacao } from '../../model/comuns/emissorPaginacao';
import { TabelaComponent } from '../../shared/tabela/tabela.component';
import { DashboardComponent } from '../login/dashboard/dashboard.component';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { TopoBreadcrumbComponent } from '../../shared/topo-breadcrumb/topo-breadcrumb.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Colunas } from '../../model/comuns/colunas';
import { Administracao } from '../../model/tela-administracao/administracao';
import { DefaultRequestsService } from '../../services/requests/default-requests.service';
import { AdministracaoModalFormularioComponent } from './administracao-modal-formulario/administracao-modal-formulario.component';

@Component({
  selector: 'app-administracao',
  templateUrl: './administracao.component.html',
  styleUrls: ['./administracao.component.scss'],
  standalone: true,
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
export class AdministracaoComponent implements OnInit {
  dadosGrid: Administracao[] = [];
  colunas: Colunas[] = [];
  dataKey: string = 'setorId';
  page: number = 0;
  size: number = 5;
  totalRegistros: number = 5;
  carregaTabela: boolean = false;
  ordenar: string = null;
  orientacao: number = null;
  ref: DynamicDialogRef;
  filtroDescricaoAdm: string = null;
  items: object[];

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
      { label: 'Administração', isPrincipal: true },
    ];
  }

  private iniciaTabela(): void {
    this.colunas = [
      { field: 'admId', header: 'Id' },
      { field: 'admNome', header: 'Administração' },
      { field: 'admCidade', header: 'Cidade' },
      { field: 'admEstado', header: 'Estado' },
      { field: 'acoes', header: 'Ações' },
    ];
    this.buscaDadosGrid();
  }

  private buscaDadosGrid(): void {
    this.carregaTabela = true;
    this.service.defaultGet(this.constroiUrl()).subscribe({
      next: (res) => {
        this.dadosGrid = res.items;

        // this.dadosGrid = [];

        // this.dadosGrid = res.items;
        this.totalRegistros = res.totalRecords;
        this.carregaTabela = false;
      },
      error: (err) => {},
    });
  }

  private constroiUrl(): string {
    let url = '/api-ccb/administracao?';

    url += `page=${this.page + 1}&size=${this.size}`;

    if (this.filtroDescricaoAdm != null && this.filtroDescricaoAdm != '') {
      url += `&nomeAdm=${this.filtroDescricaoAdm}`;
    }

    if (this.ordenar != null) {
      url += `&valueOrderBY=${this.ordenar}&isOrderByAsc=${
        this.orientacao == 1 ? true : false
      }`;
      this.ordenar = null;
    }

    return url;
  }

  cadastraAdministracao() {
    this.ref = this.dialogService.open(AdministracaoModalFormularioComponent, {
      data: null,
      header: 'Cadastro Administração',
      width: window.innerWidth >= 1200 ? '48%' : '100%',
      height: window.innerWidth >= 720 ? '35%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Administracao) => {
      if (data != null) {
        this.requisicaoCadastro(data);
      }
    });
  }

  private requisicaoCadastro(data: Administracao): void {
    let body: any = {
      admNome: data.admNome,
      admCidade: data.admCidade,
      admEstado: data.admEstado,
    };

    this.service.defaultPost('/api-ccb/administracao', body).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Setor cadastrado com sucesso!',
          key: 'toast-administracao',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error.errorMessage,
          life: 3000,
          key: 'toast-administracao',
        });
      },
    });
  }

  removeItemTabela(data: Administracao) {
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
        console.log(data);
        this.service
          .defaultDelete(`/api-ccb/administracao?id=${data.admId}`)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Setor deletado com sucesso!',
                key: 'toast-administracao',
              });
              this.buscaDadosGrid();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: err.error.errorMessage,
                life: 3000,
                key: 'toast-administracao',
              });
            },
          });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
      },
      key: 'dialog-administracao',
    });
  }

  editaTabela(data: Administracao) {
    this.ref = this.dialogService.open(AdministracaoModalFormularioComponent, {
      data: data,
      header: 'Editar Setor',
      width: window.innerWidth >= 1200 ? '48%' : '100%',
      height: window.innerWidth >= 720 ? '35%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Administracao) => {
      if (data != null) {
        this.atualizaSetores(data);
      }
      this.buscaDadosGrid();
    });
  }

  private atualizaSetores(data: Administracao) {
    this.service.defaultPut('/api-ccb/administracao', data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Setor atualizado com sucesso!',
          key: 'toast-administracao',
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
      this.filtroDescricaoAdm = null;
    }
    this.buscaDadosGrid();
  }

  pesquisarFiltro() {
    this.buscaDadosGrid();
  }
}
