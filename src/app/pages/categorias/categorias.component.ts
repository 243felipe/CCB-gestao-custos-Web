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
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoriasModalFormularioComponent } from './categorias-modal-formulario/categorias-modal-formulario.component';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TopoBreadcrumbComponent } from "../../shared/topo-breadcrumb/topo-breadcrumb.component";

@Component({
  standalone: true,
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss'],
  imports: [TabelaComponent, DashboardComponent, InputTextModule, ConfirmDialogModule, ToastModule, DynamicDialogModule, FloatLabelModule, FormsModule, TopoBreadcrumbComponent],
  providers: [ConfirmationService, MessageService, DialogService]
})
export class CategoriasComponent implements OnInit {

  dadosGrid: Categorias[] = [];
  colunas: Colunas[] = [];
  dataKey: string = 'idCategoria';
  page: number = 0;
  size: number = 5;
  totalRegistros: number = 5;
  carregaTabela: boolean = false;
  ordenar: string = null;
  orientacao: number = null;
  ref: DynamicDialogRef;
  filtroDescricaoCategoria: string = null;
  items: object[];

  constructor(public dialogService: DialogService, private service: DefaultRequestsService, private confirmationService: ConfirmationService, private messageService: MessageService) {

  }

  ngOnInit() {
    this.iniciaTabela();
    this.inicializaBreadCrumb();
  }

  private inicializaBreadCrumb():void{
    this.items = [{ icon: 'pi pi-home', route: '/dashboard' }, { label: 'Cadastro' },{ label: 'Categorias', isPrincipal: true}];
  }

  private iniciaTabela(): void {
    this.colunas = [
      {field: 'idCategoria', header: 'Id'},
      {field: 'descricaoCategoria', header: 'Descrição'},
      {field: 'tipoCategoria', header: 'Tipo'},
      {field: 'acoes', header: 'Ações'}
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
      error: (err) => {
      },
    })
  }

  private constroiUrl(): string {
    let url = '/api-ccb/categorias?';

    url += `page=${this.page + 1}&size=${this.size}`;


    if (this.filtroDescricaoCategoria != null){
      url += `&descricao=${this.filtroDescricaoCategoria}`
      this.ordenar = null;
    }

    if(this.ordenar != null){
      url += `&valueOrderBY=${this.ordenar}&isOrderByAsc=${this.orientacao == 1 ? true : false}`
    }


    return url;
  }

  public recebePaginacao(data: EmissorPaginacao): void{
    this.page = data.page;
    this.size = data.size;
    this.ordenar = data.ordenar;
    this.orientacao = data.orientacao;


    if (this.orientacao != null) {
      this.filtroDescricaoCategoria = null;
    }


    this.buscaDadosGrid();


  }

  public editaTabela(data: Categorias): void {
    this.ref = this.dialogService.open(CategoriasModalFormularioComponent, {
      data: data,
      header: 'Editar Categorias',
      width: window.innerWidth >= 1200 ? '32%' : '100%',
      height: window.innerWidth >= 720 ? 'auto%' : '100%',
      styleClass: '',
      baseZIndex: 10000
    });
    this.ref.onClose.subscribe((data: Categorias) => {
      if (data != null) {
        this.atualizaCategoria(data);
      }
    })
  }

  public cadastraCategoria(): void {
    this.ref = this.dialogService.open(CategoriasModalFormularioComponent, {
      data: null,
      header: 'Cadastro Categorias',
      width: window.innerWidth >= 1200 ? '32%' : '100%',
      height: window.innerWidth >= 720 ? 'auto%' : '100%',
      styleClass: '',
      baseZIndex: 10000
    });
    this.ref.onClose.subscribe((data: Categorias) => {
      if (data != null) {
        this.requisicaoCadastro(data);
      }
      this.buscaDadosGrid();
    })
  }

  private requisicaoCadastro(data: Categorias): void {
    let body: any = {
      descricaoCategoria: data.descricaoCategoria,
      tipoCategoria: data.tipoCategoria
    };

    this.service.defaultPost('/api-ccb/categorias', body).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria cadastrada com sucesso!', key: 'toast-categorias' });
        this.buscaDadosGrid();
      },
      error: (err) => {
      },
    })
  }

  private atualizaCategoria(data: Categorias): void {
    this.service.defaultPut('/api-ccb/categorias', data).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria atualizada com sucesso!', key: 'toast-categorias' });
        this.buscaDadosGrid();
      },
      error: (err) => {


      },
    })
  }


  public pesquisarFiltro (): void{
    this.buscaDadosGrid();
  }

  public removeItemTabela(data: Categorias): void {
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
        this.service.defaultDelete(`/api-ccb/categorias?id=${data.idCategoria}`).subscribe({
          next: (res) => {
            this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Categoria deletada com sucesso!', key: 'toast-categorias' });
            this.buscaDadosGrid();
          },
          error: (err) => {
           this.messageService.add({ severity: 'error', summary: 'Erro', detail: err.error.errorMessage, life: 3000 ,  key: 'toast-categorias'});
          },
        })
      },
      reject: () => {
        // this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'Process incomplete', life: 3000 });
      },
      key: 'dialog-categorias'
  });


  }
}
