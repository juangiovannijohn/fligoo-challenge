import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent implements OnInit {
  @Input() user?: User;
  @Input() mode: 'create' | 'edit' = 'edit';

  private fb = inject(FormBuilder);
  public activeModal = inject(NgbActiveModal);

  userForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.patchFormData();
  }

  private initializeForm(): void {
    this.userForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      avatar: ['']
    });
  }

  private patchFormData(): void {
    if (this.user && this.mode === 'edit') {
      this.userForm.patchValue({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        email: this.user.email,
        avatar: this.user.avatar
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      
      const formData = this.userForm.value;
      
      const updatedUser: Partial<User> = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        avatar: formData.avatar?.trim() || this.user?.avatar || ''
      };

      this.activeModal.close(updatedUser);
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
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

  get modalTitle(): string {
    return this.mode === 'edit' ? 'Editar Usuario' : 'Crear Usuario';
  }

  get submitButtonText(): string {
    return this.mode === 'edit' ? 'Actualizar' : 'Crear';
  }
}
