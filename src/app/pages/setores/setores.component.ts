import { Setores } from './../../model/tela-setores/setores';
import { Component, OnInit } from '@angular/core';
import { TabelaComponent } from '../../shared/tabela/tabela.component';
import { Categorias } from '../../model/tela-categorias/categorias';
import { Colunas } from '../../model/comuns/colunas';
import { DefaultRequestsService } from '../../services/requests/default-requests.service';
import { DashboardComponent } from '../login/dashboard/dashboard.component';
import { EmissorPaginacao } from '../../model/comuns/emissorPaginacao';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TopoBreadcrumbComponent } from '../../shared/topo-breadcrumb/topo-breadcrumb.component';
import { SetoresModalFormularioComponent } from './setores-modal-formulario/setores-modal-formulario.component';

@Component({
  standalone: true,
  selector: 'app-setores',
  templateUrl: './setores.component.html',
  styleUrls: ['./setores.component.scss'],
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
export class SetoresComponent implements OnInit {
  dadosGrid: Setores[] = [];
  colunas: Colunas[] = [];
  dataKey: string = 'setorId';
  page: number = 0;
  size: number = 5;
  totalRegistros: number = 5;
  carregaTabela: boolean = false;
  ordenar: string = null;
  orientacao: number = null;
  ref: DynamicDialogRef;
  filtroDescricaoSetores: string = null;
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
      { label: 'Setores', isPrincipal: true },
    ];
  }

  private iniciaTabela(): void {
    this.colunas = [
      { field: 'setorId', header: 'Id' },
      { field: 'admNome', header: 'Administração' },
      { field: 'setorNome', header: 'Nome do Setor' },
      { field: 'acoes', header: 'Ações' },
    ];
    this.buscaDadosGrid();
  }

  private buscaDadosGrid(): void {
    this.carregaTabela = true;
    this.service.defaultGet(this.constroiUrl()).subscribe({
      next: (res) => {
        const resValue = res.items.map((item) => ({
          setorId: item.setorId,
          admNome: item.adm != undefined ? item.adm.admNome : item.admNome, // Incluindo admNome
          setorNome: item.setorNome,
          admId: item.adm != undefined ? item.adm.admId: item.admNome ,
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
    let url = '/api-ccb/setores?';

    url += `page=${this.page + 1}&size=${this.size}`;

    if (this.filtroDescricaoSetores != null && this.filtroDescricaoSetores != '') {
      url += `&nomeSetor=${this.filtroDescricaoSetores}`;
    }

    if (this.ordenar != null && this.ordenar != 'admNome') {
      url += `&valueOrderBY=${this.ordenar}&isOrderByAsc=${this.orientacao == 1 ? true : false}`;
      this.ordenar = null;
    }

    return url;
  }

  cadastraSetores() {
    this.ref = this.dialogService.open(SetoresModalFormularioComponent, {
      data: null,
      header: 'Cadastro Setor',
      width: window.innerWidth >= 1200 ? '32%' : '100%',
      height: window.innerWidth >= 720 ? '35%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Setores) => {
      if (data != null) {
        this.requisicaoCadastro(data);
      }
    });
  }

  private requisicaoCadastro(data: Setores): void {
    let body: any = {
      admId: data.admId,
      setorNome: data.setorNome,
    };

    this.service.defaultPost('/api-ccb/setores', body).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Setor cadastrado com sucesso!',
          key: 'toast-setor',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.errorMessage, life: 3000 ,  key: 'toast-setor'});
      },
    });
  }

  removeItemTabela(data: Setores) {
    this.confirmationService.confirm({
      message: 'Tem certeza que você quer remover?',
      header: 'Confirmação',
      icon: 'pi pi-info-circle',
      acceptIcon:"none",
      rejectIcon:"none",
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      acceptButtonStyleClass: 'p-button-color',
      rejectButtonStyleClass:"p-button-text color-padrao",
      accept: () => {

        console.log(data)
        this.service.defaultDelete(`/api-ccb/setores?id=${data.setorId}`).subscribe({
          next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Setor deletado com sucesso!', key: 'toast-setor' });
            this.buscaDadosGrid();
          },
          error: (err) => {
           this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.errorMessage, life: 3000 ,  key: 'toast-setor'});
          },
        })
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
      },
      key: 'dialog-setores'
  });  }

  editaTabela(data: Setores) {
    this.ref = this.dialogService.open(SetoresModalFormularioComponent, {
      data: data,
      header: 'Editar Setor',
      width: window.innerWidth >= 1200 ? '32%' : '100%',
      height: window.innerWidth >= 720 ? '35%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Setores) => {
      if (data != null) {
        this.atualizaSetores(data);
      }
      this.buscaDadosGrid();

    });
  }

  private atualizaSetores(data: Setores) {
    this.service.defaultPut('/api-ccb/setores', data).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Setor atualizado com sucesso!', key: 'toast-setores' });
        this.buscaDadosGrid();
      },
      error: (err) => {


      },
    })
  }


  recebePaginacao(data: EmissorPaginacao) {
    this.page = data.page;
    this.size = data.size;
    this.ordenar = data.ordenar;
    this.orientacao = data.orientacao;

    if (this.orientacao != null){
      this.filtroDescricaoSetores = null;
    }
    this.buscaDadosGrid();
  }

  pesquisarFiltro() {
    this.buscaDadosGrid();
  }
}
