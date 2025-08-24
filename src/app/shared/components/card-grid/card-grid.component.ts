import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-card-grid',
  templateUrl: './card-grid.component.html',
  styleUrls: ['./card-grid.component.scss']
})
export class CardGridComponent {
  @Input() users: User[] = [];
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();
  @Output() viewUser = new EventEmitter<User>();

  handleEdit(user: User) {
    this.editUser.emit(user);
  }

  handleDelete(user: User) {
    this.deleteUser.emit(user);
  }

  handleView(user: User) {
    this.viewUser.emit(user);
  }
}
