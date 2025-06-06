import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../model/tela-usuarios/usuarios';
import { Colunas } from '../../model/comuns/colunas';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DefaultRequestsService } from '../../services/requests/default-requests.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsuariosModalFormularioComponent } from './usuarios-modal-formulario/usuarios-modal-formulario.component';
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
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
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
export class UsuariosComponent implements OnInit {
  dadosGrid: Usuarios[] = [];
  colunas: Colunas[] = [];
  dataKey: string = 'setorId';
  page: number = 0;
  size: number = 5;
  totalRegistros: number = 5;
  carregaTabela: boolean = false;
  ordenar: string = null;
  orientacao: number = null;
  ref: DynamicDialogRef;
  filtroDescricaoUsuario: string = null;
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
      { label: 'Usuarios', isPrincipal: true },
    ];
  }

  private iniciaTabela(): void {
    this.colunas = [
      { field: 'idUsuario', header: 'Id' },
      { field: 'nomeUsuario', header: 'Nome do Usuário' },
      { field: 'emailUsuario', header: 'Email do Usuário' },
      { field: 'nomeAdm', header: 'Administração' },
      { field: 'nomeSetor', header: 'Setor' },
      // { field: 'nomeIgr', header: 'Casa de Oração' },
      { field: 'acoes', header: 'Ações' },
    ];
    this.buscaDadosGrid();
  }

  private buscaDadosGrid(): void {
    this.carregaTabela = true;
    this.service.defaultGet(this.constroiUrl()).subscribe({
      next: (res) => {
        console.log(res);

        this.dadosGrid = res.items;
        this.totalRegistros = res.totalRecords;
        this.carregaTabela = false;
      },
      error: (err) => {},
    });
  }

  private constroiUrl(): string {
    let url = '/api-ccb/usuarios?';

    url += `page=${this.page + 1}&size=${this.size}`;

    if (this.filtroDescricaoUsuario != null &&  this.filtroDescricaoUsuario != '') {
      url += `&nomeUsuario=${this.filtroDescricaoUsuario}`;
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

  cadastraUsuario() {
    this.ref = this.dialogService.open(UsuariosModalFormularioComponent, {
      data: null,
      header: 'Cadastro de Usuário',
      width: window.innerWidth >= 1200 ? '25%' : '100%',
      height: window.innerWidth >= 720 ? '66%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
      contentStyle: {
        // overflow: window.innerWidth >= 1600 ? 'initial' : ' ',
      },
    });
    this.ref.onClose.subscribe((data: Usuarios) => {
      if (data != null) {
        console.log(data);
        this.requisicaoCadastro(data);
      }
    });
  }

  private requisicaoCadastro(data: Usuarios): void {
    let body: any = {
      nomeUsuario: data.nomeUsuario,
      emailUsuario: data.emailUsuario,
      senha: data.senha,
      admId: data.admId,
      setorId: data.setorId,
      igrId: data.igrId,
      idPerfil: data.idPerfil,
    };

    this.service.defaultPost('/api-ccb/usuarios/cadastrar-usuario', body).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuario cadastrado com sucesso!',
          key: 'toast-cadastro-usuario',
        });
        this.buscaDadosGrid();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error.message,
          life: 3000,
          key: 'toast-cadastro-usuario',
        });
      },
    });
  }

  removeItemTabela(data: Usuarios) {
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
          .defaultDelete(`/api-ccb/usuarios/deletar-usuario?idUsuario=${data.idUsuario}`)
          .subscribe({
            next: (res) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Usuário deletado com sucesso!',
                key: 'toast-cadastro-usuario',
              });
              this.buscaDadosGrid();
            },
            error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: err.error.message,
                life: 3000,
                key: 'toast-cadastro-usuario',
              });
            },
          });
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
      },
      key: 'dialog-cadastro-usuario',
    });
  }

  editaTabela(data: Usuarios) {
    this.ref = this.dialogService.open(UsuariosModalFormularioComponent, {
      data: data,
      header: 'Editar',
      width: window.innerWidth >= 1200 ? '50%' : '100%',
      height: window.innerWidth >= 720 ? '50%' : '100%',
      styleClass: '',
      baseZIndex: 10000,
    });
    this.ref.onClose.subscribe((data: Usuarios) => {
      if (data != null) {
        this.atualizaSetores(data);
      }
      this.buscaDadosGrid();
    });
  }

  private atualizaSetores(data: Usuarios) {
    this.service.defaultPut('/api-ccb/casa-oracoes', data).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Casa de Oração atualizada com sucesso!',
          key: 'toast-cadastro-usuario',
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
      this.filtroDescricaoUsuario = null;
    }
    this.buscaDadosGrid();
  }

  pesquisarFiltro() {
    this.buscaDadosGrid();
  }
}
