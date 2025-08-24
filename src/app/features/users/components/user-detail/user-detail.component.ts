import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/shared/interfaces/user.interface';
import { UserStore } from '../../stores/user.store';
import { ModalService } from 'src/app/shared/services/modal-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userStore = inject(UserStore);
  private modalService = inject(ModalService);
  private destroy$ = new Subject<void>();
  private fb = inject(FormBuilder);

  user: User | null = null;
  loading = true;
  userId: number = 0;

    userForm: FormGroup = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      avatar: ['']
    });

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.userId = +params['id'];
        this.loadUser();

      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

    private patchFormData(): void {
    if (this.user) {
      this.userForm.patchValue({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
        avatar: this.user.avatar
      });
    }
  }

  loadUser() {
    this.loading = true;
    this.userStore.getUserById(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.loading = false;
          this.user = user;
          this.patchFormData();
          this.disableForm();
        },
        error: (err) => {
          this.loading = false;
        }
      });
  }

  onEdit(): void {
    if (!this.user) return;
    this.enableForm();

  }

  onDelete(): void {
    if (!this.user) return;

    const modalRef = this.modalService.openConfirmModal({
      title: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar a ${this.user.first_name} ${this.user.last_name}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      type: 'danger'
    });

    modalRef.result.then((confirmed) => {
      if (confirmed && this.user) {
        this.userStore.deleteUser(this.user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['/users']);
            },
            error: (error) => {
              console.error('Error al eliminar usuario:', error);
            }
          });
      }
    })
  }

  disableForm(): void {
    this.userForm.disable();
  }

  enableForm(): void {
    this.userForm.enable();
  }
  goBack() {
    this.router.navigate(['/users']);
  }

    onSubmit(): void {
    if (this.userForm.valid && !this.loading) {
      this.loading = true;
      
      const formData = this.userForm.value;
    
      const updatedUser: Partial<User> = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        avatar: formData.avatar?.trim() || this.user?.avatar || ''
      };

      this.userStore.updateUser(this.userId, updatedUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          this.user = updatedUser;
          this.loading = false;
          this.disableForm();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al actualizar usuario:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

    private markFormGroupTouched(): void {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }

  get firstName() { return this.userForm.get('first_name'); }
  get lastName() { return this.userForm.get('last_name'); }
  get email() { return this.userForm.get('email'); }
  get avatar() { return this.userForm.get('avatar'); }
  get isDisabled() { return this.userForm.disabled; }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.userForm.get(controlName);
    return !!(control?.hasError(errorType) && (control?.dirty || control?.touched));
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    
    if (control?.hasError('required')) {
      return `${this.getFieldLabel(controlName)} es requerido`;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `${this.getFieldLabel(controlName)} debe tener al menos ${minLength} caracteres`;
    }
    
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return `${this.getFieldLabel(controlName)} no puede exceder ${maxLength} caracteres`;
    }
    
    if (control?.hasError('email')) {
      return 'Ingresa un email válido';
    }
    
    return '';
  }

  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      'first_name': 'Nombre',
      'last_name': 'Apellido',
      'email': 'Email',
      'avatar': 'Avatar'
    };
    return labels[controlName] || controlName;
  }
}
