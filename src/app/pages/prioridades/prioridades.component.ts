import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Prioridades } from '../../model/tela-prioridades/prioridades';
import { Colunas } from '../../model/comuns/colunas';
import { DefaultRequestsService } from '../../services/requests/default-requests.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmissorPaginacao } from '../../model/comuns/emissorPaginacao';
import { PrioridadesModalFormularioComponent } from './prioridades-modal-formulario/prioridades-modal-formulario.component';
import { TopoBreadcrumbComponent } from '../../shared/topo-breadcrumb/topo-breadcrumb.component';
import { DashboardComponent } from '../login/dashboard/dashboard.component';
import { TabelaComponent } from '../../shared/tabela/tabela.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'app-prioridades',
  templateUrl: './prioridades.component.html',
  styleUrls: ['./prioridades.component.scss'],
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
export class PrioridadesComponent implements OnInit {
  dadosGrid: Prioridades[] = [];
  colunas: Colunas[] = [];
  dataKey: string = 'idPrioridade';
  page: number = 0;
  size: number = 5;
  totalRegistros: number = 5;
  carregaTabela: boolean = false;
  ordenar: string = null;
  orientacao: number = null;
  ref: DynamicDialogRef;
  filtroDescricaoPrioridade: string = null;
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
      { label: 'Prioridades', route: '/prioridades', isPrincipal: true },
    ];
  }

  private iniciaTabela(): void {
    this.colunas = [
      { field: 'idPrioridade', header: 'Id' },
      { field: 'nomePrioridade', header: 'Nome da Prioridade' },
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
    let url = '/api-ccb/prioridades?';

    url += `page=${this.page + 1}&size=${this.size}`;

    if (
      this.filtroDescricaoPrioridade != null &&
      this.filtroDescricaoPrioridade != ''
    ) {
      url += `&nomePrioridade=${this.filtroDescricaoPrioridade}`;
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
      this.filtroDescricaoPrioridade = null;
    }
    this.buscaDadosGrid();
  }

  public editaTabela(data: Prioridades): void {
    this.ref = this.dialogService.open(PrioridadesModalFormularioComponent, {
      data: data,
      header: 'Editar Prioridade',
      width: window.innerWidth >= 1200 ? '32%' : '100%',
      height: window.innerWidth >= 720 ? 'auto%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Prioridades) => {
      if (data != null) {
        this.atualizaCategoria(data);
      }
      this.buscaDadosGrid();
    });
  }

  public cadastraCategoria(): void {
    this.ref = this.dialogService.open(PrioridadesModalFormularioComponent, {
      data: null,
      header: 'Cadastro Prioridade',
      width: window.innerWidth >= 1200 ? '32%' : '100%',
      height: window.innerWidth >= 720 ? 'auto%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Prioridades) => {
      if (data != null) {
        this.requisicaoCadastro(data);
      }
    });
  }

  private requisicaoCadastro(data: Prioridades): void {
    let body: any = {
      nomePrioridade: data.nomePrioridade,
    };

    this.service.defaultPost('/api-ccb/prioridades', body).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Prioridade cadastrada com sucesso!',
          key: 'toast-prioridades',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {},
    });
  }

  private atualizaCategoria(data: Prioridades): void {
    this.service.defaultPut('/api-ccb/prioridades', data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Prioridade atualizada com sucesso!',
          key: 'toast-prioridades',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {},
    });
  }

  public pesquisarFiltro(): void {
    this.buscaDadosGrid();
  }

  public removeItemTabela(data: Prioridades): void {
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
          .defaultDelete(`/api-ccb/prioridades?id=${data.idPrioridade}`)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Prioridade deletado com sucesso!',
                key: 'toast-prioridades',
              });
              this.buscaDadosGrid();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: err.message,
                life: 3000,
                key: 'toast-prioridades',
              });
            },
          });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
      },
      key: 'dialog-prioridades',
    });
  }
}
