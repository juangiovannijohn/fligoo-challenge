import { User } from "./user.interface";

export interface ConfirmModalData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface UserModalData {
  user?: User;
  mode: 'create' | 'edit';
}

