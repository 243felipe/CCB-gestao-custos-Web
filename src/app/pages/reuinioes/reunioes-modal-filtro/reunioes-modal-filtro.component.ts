import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-reunioes-modal-filtro',
  templateUrl: './reunioes-modal-filtro.component.html',
  styleUrls: ['./reunioes-modal-filtro.component.scss'],
  standalone: true,
  imports: [CalendarModule, FormsModule, InputTextModule, FloatLabelModule],
})
export class ReunioesModalFiltroComponent implements OnInit {
  constructor(
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef
  ) {}

  ngOnInit() {}

  dateInicial: string;
  dateFinal: string;
  dataMaximaFinal: any;
  dataMinimaFinal: any;
  selectedDataInicial: any;
  selectedDataFinal: any;
  dataMaximaInicial: any;
  filtroDescricaoReuniao: string = null;

  public pesquisarFiltro(): void {}

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

  public filtrarDados(): void {
    this.ref.close(
      {
        dataInicial:
          this.dateInicial != undefined && this.dateInicial != null
            ? this.dateInicial
            : null,
        dataFinal:
          this.dateFinal != undefined && this.dateFinal != null
            ? this.dateFinal
            : null,

        filtroDescricao:
          this.filtroDescricaoReuniao != undefined &&
          this.filtroDescricaoReuniao != null
            ? this.filtroDescricaoReuniao
            : null,
      },
    );
    return;
  }

  public cancelar(): void {
    this.ref.close(null);
  }
}
