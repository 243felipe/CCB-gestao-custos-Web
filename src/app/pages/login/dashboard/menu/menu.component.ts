import { TokenService } from './../../../../services/token/token.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { TreeModule, TreeNodeSelectEvent } from 'primeng/tree';

@Component({
  standalone: true,
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [TreeModule, SidebarModule, ButtonModule],
})
export class MenuComponent implements OnInit {
  @Input() menu: TreeNode[] = [];
  @Input() sidebarVisible: boolean = false;
  @Output() emiteSairMenu: EventEmitter<boolean> = new EventEmitter();
  @Output() emiteRota: EventEmitter<string> = new EventEmitter();

  constructor(private router: Router, private tokenService: TokenService) {}

  ngOnInit() {}

  public escondeMenu(): void {
    this.sidebarVisible = false;
    this.emiteSairMenu.emit(this.sidebarVisible);
  }

  public encerrarSessao(): void {
    this.tokenService.logout();
  }

  public clicaMenu(event: TreeNodeSelectEvent): void {
    const node = event.node;
    if (node.expanded) {
      this.collapseNode(node);
    } else {
      this.expandNode(node);
    }
    console.log(event);
    if (event.node.data != null || event.node.data != undefined) {
      this.emiteRota.emit(event.node.data);
    }
  }

  expandNode(node: TreeNode) {
    // Expande o nó clicado
    node.expanded = true;
  }

  collapseNode(node: TreeNode) {
    // Colapsa o nó clicado
    node.expanded = false;
  }


  public desclicaMenu(event: TreeNodeSelectEvent): void {
    const node = event.node;
    if (node.expanded) {
      this.collapseNode(node);
    }
  }

}
