import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  private router = inject(Router);
  @Input() iconName: string = 'person-x';
  @Input() title: string = 'No hay datos disponibles';
  @Input() detailText: string = 'Parece que no hay información para mostrar en este momento.';
  @Input() buttonText: string = 'Actualizar';

  reloadPage(): void {
    window.location.reload();
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
