import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Categorias } from '../../../model/tela-categorias/categorias';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ValidadorCategoria } from '../../../model/tela-categorias/validadorCategoria';

@Component({
  standalone: true,
  selector: 'app-categorias-modal-formulario',
  templateUrl: './categorias-modal-formulario.component.html',
  styleUrls: ['./categorias-modal-formulario.component.scss'],
  imports: [DynamicDialogModule, InputTextModule, FloatLabelModule, FormsModule, ButtonModule]
})
export class CategoriasModalFormularioComponent implements OnInit {

  dadosFormulario: Categorias = {

  };
  ehCadastro: boolean = true;

  validador: ValidadorCategoria = {
    descricaoCategoria: true,
    tipoCategoria: true
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

    if(this.dadosFormulario.descricaoCategoria == null || this.dadosFormulario.descricaoCategoria == undefined || this.dadosFormulario.descricaoCategoria == ''){
      dadosValidos = false;
      this.validador.descricaoCategoria = false;
    }else{
      this.validador.descricaoCategoria = true;
    }

    if(this.dadosFormulario.tipoCategoria == null || this.dadosFormulario.tipoCategoria == undefined || this.dadosFormulario.tipoCategoria == ''){
      dadosValidos = false;
      this.validador.tipoCategoria = false;
    }else{
      this.validador.tipoCategoria = true;
    }

    return dadosValidos;
  }

  public sairModal(): void {
    this.ref.close(null);
  }

}
