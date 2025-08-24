import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() onEdit = new EventEmitter<User>();
  @Output() onDelete = new EventEmitter<User>();
  @Output() onView = new EventEmitter<User>();

  handleEdit() {
    this.onEdit.emit(this.user);
  }

  handleDelete() {
    this.onDelete.emit(this.user);
  }

  handleView() {
    this.onView.emit(this.user);
  }
}
