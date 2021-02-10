import { NgModule } from '@angular/core';
import { Routes, RouterModule  } from '@angular/router';
import { TemplateComponent } from './components/template/template.component';
import { NewletterComponent } from './components/newletter/newletter.component';

const routes: Routes = [

  // Common

 // { path: '', redirectTo: 'new', pathMatch: 'full' },
  { path: '', component: NewletterComponent },
  { path: 'template', component: TemplateComponent, pathMatch: 'full' },
  { path: '**', redirectTo: 'error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled', useHash: true 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
