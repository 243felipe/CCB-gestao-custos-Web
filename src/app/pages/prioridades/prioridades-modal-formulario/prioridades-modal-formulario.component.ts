import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ValidatorPrioridades } from '../../../model/tela-prioridades/validatorPrioridades';
import { Prioridades } from '../../../model/tela-prioridades/prioridades';
@Component({
  standalone: true,
  selector: 'app-prioridades-modal-formulario',
  templateUrl: './prioridades-modal-formulario.component.html',
  styleUrls: ['./prioridades-modal-formulario.component.scss'],
  imports: [DynamicDialogModule, InputTextModule, FloatLabelModule, FormsModule, ButtonModule]

})
export class PrioridadesModalFormularioComponent implements OnInit {
  dadosFormulario: Prioridades = {
  };
  ehCadastro: boolean = true;

  validador: ValidatorPrioridades = {
    prioridadeNome: true,
  }

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) { }

  ngOnInit() {
    this.iniciaVariaveis();
  }

  private iniciaVariaveis(): void {
    if(this.config.data != null){
      this.dadosFormulario = this.config.data;
      this.ehCadastro = false;
    }
  }

  public salvarDados(): void {
    if(!this.verificaCampos()){
      return;
    }
    this.ref.close(this.dadosFormulario);
  }

  private verificaCampos(): boolean {
    let dadosValidos: boolean = true;

    if(this.dadosFormulario.nomePrioridade == null || this.dadosFormulario.nomePrioridade == undefined || this.dadosFormulario.nomePrioridade == ''){
      dadosValidos = false;
      this.validador.prioridadeNome = false;
    }else{
      this.validador.prioridadeNome = true;
    }
    return dadosValidos;
  }

  public sairModal(): void {
    this.ref.close(null);
  }

}
