import { inject, Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../modals/confirm-modal/confirm-modal.component';
import { User } from '../interfaces/user.interface';
import { UserEditModalComponent } from '../modals/user-edit-modal/user-edit-modal.component';
import { ConfirmModalData, UserModalData } from '../interfaces/user-modal.interface';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
ngbModal = inject(NgbModal);

  openConfirmModal(data: ConfirmModalData): NgbModalRef {
    const modalRef: NgbModalRef = this.ngbModal.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.title = data.title;
    modalRef.componentInstance.message = data.message;
    modalRef.componentInstance.confirmText = data.confirmText || 'Confirmar';
    modalRef.componentInstance.cancelText = data.cancelText || 'Cancelar';
    modalRef.componentInstance.type = data.type || 'info';

    return modalRef
  }

  openUserModal(data: UserModalData): NgbModalRef {
    const modalRef: NgbModalRef = this.ngbModal.open(UserEditModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.user = data.user;
    modalRef.componentInstance.mode = data.mode;

    return modalRef
  }

  openEditUserModal(user: User): NgbModalRef {
    const modalRef: NgbModalRef = this.ngbModal.open(UserEditModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      size: 'lg'
    });

    modalRef.componentInstance.mode = 'edit';
    modalRef.componentInstance.user = { ...user };

    return modalRef
  }

  openDeleteUserModal(userName: string): NgbModalRef {
    return this.openConfirmModal({
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de que deseas eliminar al usuario "${userName}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
  }

  closeAll(): void {
    this.ngbModal.dismissAll();
  }
}
