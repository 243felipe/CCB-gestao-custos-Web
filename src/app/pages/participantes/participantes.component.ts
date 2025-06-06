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
import { Colunas } from '../../model/comuns/colunas';
import { Participantes } from '../../model/tela-participantes/participantes';
import { DefaultRequestsService } from '../../services/requests/default-requests.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ParticipantesModalFormularioComponent } from './participantes-modal-formulario/participantes-modal-formulario.component';

@Component({
  standalone: true,
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.scss'],
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
export class ParticipantesComponent implements OnInit {
  dadosGrid: Participantes[] = [];
  colunas: Colunas[] = [];
  dataKey: string = 'setorId';
  page: number = 0;
  size: number = 5;
  totalRegistros: number = 5;
  carregaTabela: boolean = false;
  ordenar: string = null;
  orientacao: number = null;
  ref: DynamicDialogRef;
  filtroDescricaoParticipantes: string = null;
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
      { label: 'Participantes', isPrincipal: true },
    ];
  }

  private iniciaTabela(): void {
    this.colunas = [
      { field: 'idParticipantes', header: 'Id' },
      { field: 'nomeParticipante', header: 'Participante' },
      { field: 'cargoParticipante', header: 'Cargo' },
      { field: 'comumParticipante', header: 'Comum' },
      { field: 'reuniaoDescricao', header: 'Reunião' },
      { field: 'acoes', header: 'Ações' },
    ];
    this.buscaDadosGrid();
  }

  private buscaDadosGrid(): void {
    this.carregaTabela = true;
    this.service.defaultGet(this.constroiUrl()).subscribe({
      next: (res) => {
        const resValue = res.items.map((item) => ({
          idParticipantes: item.idParticipantes,
          nomeParticipante: item.nomeParticipante,
          reuniaoDescricao:
            item.reuniaoId != undefined
              ? item.reuniaoId.reuniaoDescricao
              : item.reuniaoDescricao,
          reuniaoId:
            item.reuniaoId != undefined
              ? item.reuniaoId.reuniaoId
              : item.idReuniao,
          cargoParticipante: item.cargoParticipante,
          comumParticipante: item.comumParticipante,
        }));

        this.dadosGrid = resValue;

        // this.dadosGrid = [];

        // this.dadosGrid = res.items;
        this.totalRegistros = res.totalRecords;
        this.carregaTabela = false;
      },
      error: (err) => {},
    });
  }

  private constroiUrl(): string {
    let url = '/api-ccb/cadastro-participantes?';

    url += `page=${this.page + 1}&size=${this.size}`;

    if (
      this.filtroDescricaoParticipantes != null &&
      this.filtroDescricaoParticipantes != ''
    ) {
      url += `&nomeParticipante=${this.filtroDescricaoParticipantes}`;
    }

    if (this.ordenar != null && this.ordenar != 'reuniaoDescricao') {
      url += `&valueOrderBY=${this.ordenar}&isOrderByAsc=${
        this.orientacao == 1 ? true : false
      }`;
      this.ordenar = null;
    }

    return url;
  }

  cadastraParticipantes() {
    this.ref = this.dialogService.open(ParticipantesModalFormularioComponent, {
      data: null,
      header: 'Cadastro Participante',
      width: window.innerWidth >= 1200 ? '55%' : '100%',
      height: window.innerWidth >= 720 ? '50%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Participantes) => {
      if (data != null) {
        this.requisicaoCadastro(data);
      }
    });
  }

  private requisicaoCadastro(data: Participantes): void {
    let body: any = {
      reuniaoId: data.reuniaoId,
      nomeParticipante: data.nomeParticipante,
      cargoParticipante: data.cargoParticipante,
      comumParticipante: data.comumParticipante,
    };

    this.service
      .defaultPost('/api-ccb/cadastro-participantes', body)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Participante cadastrado com sucesso!',
            key: 'toast-participantes',
          });
          this.buscaDadosGrid();
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err.error.errorMessage,
            life: 3000,
            key: 'toast-participantes',
          });
        },
      });
  }

  removeItemTabela(data: Participantes) {
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
          .defaultDelete(
            `/api-ccb/cadastro-participantes?id=${data.idParticipantes}`
          )
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Participante deletado com sucesso!',
                key: 'toast-participantes',
              });
              this.buscaDadosGrid();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: err.error.errorMessage,
                life: 3000,
                key: 'toast-participantes',
              });
            },
          });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
      },
      key: 'dialog-setores',
    });
  }

  editaTabela(data: Participantes) {
    this.ref = this.dialogService.open(ParticipantesModalFormularioComponent, {
      data: data,
      header: 'Editar Participante',
      width: window.innerWidth >= 1200 ? '55%' : '100%',
      height: window.innerWidth >= 720 ? '50%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Participantes) => {
      if (data != null) {
        console.log(data);
        this.atualizaSetores(data);
      }

      this.buscaDadosGrid();
    });
  }

  private atualizaSetores(data: Participantes) {
    let body = {
      idParticipantes: data.idParticipantes,
      nomeParticipante: data.nomeParticipante,
      cargoParticipante: data.cargoParticipante,
      comumParticipante: data.comumParticipante,
    };

    this.service.defaultPut('/api-ccb/cadastro-participantes', body).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Participante atualizado com sucesso!',
          key: 'toast-participantes',
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
      this.filtroDescricaoParticipantes = null;
    }
    this.buscaDadosGrid();
  }

  pesquisarFiltro() {
    this.buscaDadosGrid();
  }
}
