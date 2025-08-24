import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardGridComponent } from './components/card-grid/card-grid.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { ConfirmModalComponent } from './modals/confirm-modal/confirm-modal.component';
import { UserEditModalComponent } from './modals/user-edit-modal/user-edit-modal.component';
import { ModalService } from './services/modal-service.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutComponent } from './components/layout/layout.component';
import { RouterModule } from "@angular/router";



@NgModule({
  declarations: [
    CardGridComponent,
    UserCardComponent,
    SearchBoxComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent,
    ConfirmModalComponent,
    UserEditModalComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    RouterModule,
    NgbPaginationModule
],
  exports: [
    CardGridComponent,
    UserCardComponent,
    SearchBoxComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    PaginationComponent,
    ConfirmModalComponent,
    UserEditModalComponent,
    LayoutComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    ModalService
  ]
})
export class SharedModule { }
