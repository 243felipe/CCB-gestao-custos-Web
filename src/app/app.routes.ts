import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './pages/login/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { CodigoAutenticacaoComponent } from './pages/login/codigo-autenticacao/codigo-autenticacao.component';
import { TokenService } from './services/token/token.service';
import { authGuard } from './services/guard/auth.guard';
import { AuthGuardService } from './services/token/authGuard.service';
import { TesteComponent } from './pages/login/teste/teste.component';
import { CategoriasComponent } from './pages/categorias/categorias.component';
import { SetoresComponent } from './pages/setores/setores.component';
import { PrioridadesComponent } from './pages/prioridades/prioridades.component';
import { ReuinioesComponent } from './pages/reuinioes/reuinioes.component';
import { ParticipantesComponent } from './pages/participantes/participantes.component';
import { CasaOracoesComponent } from './pages/casaOracoes/casaOracoes.component';
import { AdministracaoComponent } from './pages/administracao/administracao.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { DemandasComponent } from './pages/demandas/demandas.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'autenticar-codigo',
    component: CodigoAutenticacaoComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'login',
    redirectTo: '',
  },
  {
    path: 'categorias',
    component: CategoriasComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'setores',
    component: SetoresComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'prioridades',
    component: PrioridadesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'reunioes',
    component: ReuinioesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'participantes',
    component: ParticipantesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'casa-oracoes',
    component: CasaOracoesComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'administracao',
    component: AdministracaoComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'demandas',
    component: DemandasComponent,
    canActivate: [AuthGuardService],
  },

];
