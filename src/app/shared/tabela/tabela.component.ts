import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { EmissorPaginacao } from '../../model/comuns/emissorPaginacao';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  standalone: true,
  selector: 'app-tabela',
  templateUrl: './tabela.component.html',
  styleUrls: ['./tabela.component.scss'],
  imports: [TableModule, ButtonModule, CommonModule, ProgressSpinnerModule]
})
export class TabelaComponent implements OnInit {

  @Input() colunas: any [] = [];
  @Input() dadosGrid: any[] = [];
  @Input() dataKey: string;
  @Input() carregaTabela: boolean;
  @Input() totalRegistros: number;
  @Input() page: number;
  @Input() size: number;
  elementosPagina: number = 0;
  @Output() emissorPaginacao: EventEmitter<EmissorPaginacao> = new EventEmitter();
  @Output() emissorEditar: EventEmitter<any> = new EventEmitter();
  @Output() emissorRemover: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }


  public pagina(event: any): void {
    this.page = event.first / event.rows;
    this.size = event.rows;
    let data: EmissorPaginacao = {
      page: this.page,
      size: this.size,
      ordenar: event.sortField != undefined && event.sortField != 'acoes' ? event.sortField : null,
      orientacao: event.sortField != undefined && event.sortField != 'acoes' ? event.sortOrder : null
    }
    this.emissorPaginacao.emit(data);
  }

  public editaLinha(rowData: any): void {
    this.emissorEditar.emit(rowData);
  }

  public deletaLinha(rowData: any): void {
    this.emissorRemover.emit(rowData);
  }
}
