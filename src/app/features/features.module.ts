import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users/components/users-list/users-list.component';
import { SharedModule } from "src/app/shared/shared.module";
import { UserDetailComponent } from './users/components/user-detail/user-detail.component';



@NgModule({
  declarations: [
    UsersListComponent,
    UserDetailComponent
  ],
  imports: [
    CommonModule,
    SharedModule
]
})
export class FeaturesModule { }
