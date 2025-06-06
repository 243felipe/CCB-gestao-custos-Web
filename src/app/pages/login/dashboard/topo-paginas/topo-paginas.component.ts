import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';

@Component({
  standalone: true,
  selector: 'app-topo-paginas',
  templateUrl: './topo-paginas.component.html',
  styleUrls: ['./topo-paginas.component.scss'],
  imports: [ToolbarModule, ButtonModule]
})
export class TopoPaginasComponent implements OnInit {

  @Input() sidebarVisible: boolean = false;
  @Output() emiteAbrirMenu: EventEmitter<boolean> = new EventEmitter();


  @Input() isMenuDashBoard: boolean;

  constructor() { }

  ngOnInit() {
  }

  public clicaMenu(): void {
    if(this.sidebarVisible){
      this.sidebarVisible = false;
    }else{
      this.sidebarVisible = true;
    }
    this.emiteAbrirMenu.emit(this.sidebarVisible)
  }



}
