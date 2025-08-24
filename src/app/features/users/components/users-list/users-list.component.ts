import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { ModalService } from 'src/app/shared/services/modal-service.service';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private router = inject(Router);
  userStore = inject(UserStore);
  private destroy$ = new Subject<void>();

  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 6;
  itemsPerPageOptions = [2, 3, 6, 12];

  ngOnInit() {
    this.setupSubscriptions();
    this.loadUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSubscriptions() {
    this.userStore.filteredUsers$
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => {
        this.filteredUsers = users;
      });

    this.userStore.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

      this.userStore.totalPages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(totalPages => {
        this.totalPages = totalPages;
      });

      this.userStore.currentPage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(currentPage => {
        this.currentPage = currentPage;
      });
  }

  loadUsers() {
    this.userStore.loadUsers(this.currentPage, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onItemsPerPageChange() {
    this.loadUsers();
  }

  onSearch(term: string) {
    this.userStore.setSearchTerm(term);
  }

  onCreateUser() {
    const modalRef = this.modalService.openUserModal({
      mode: 'create'
    });

    modalRef.result.then((result) => {
      console.log(' se cieraaa')
      if (result) {
        this.loading = true;
        this.userStore.createUser(result)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
            },
            error: (error) => {
              console.error('Error al crear usuario:', error);
            }
          });
      }
    });
  }

  onEditUser(user: User) {
    const modalRef = this.modalService.openUserModal({
      user: user,
      mode: 'edit'
    });

    modalRef.result.then((result) => {
      if (result) {
        this.loading = true;
        this.userStore.updateUser(user.id, result)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
            },
            error: (error) => {
              console.error('Error al actualizar usuario:', error);
            }
          });
      }
    });
  }

  onDeleteUser(user: User) {
    const modalRef = this.modalService.openConfirmModal({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar a ${user.first_name} ${user.last_name}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    modalRef.result.then((confirmed) => {
      if (confirmed) {
        this.loading = true;
        this.userStore.deleteUser(user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loading = false;
            },
            error: (error) => {
              console.error('Error al eliminar usuario:', error);
            }
          });
      }
    });
  }

  onViewUser(user: User) {
    this.router.navigate(['/users', user.id]);
  }

  onPageChange(page: number) {
    this.userStore.loadUsers(page, this.itemsPerPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  get displayUsers(): User[] {
    return this.filteredUsers;
  }
}
