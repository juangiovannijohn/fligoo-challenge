import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() pageSize: number = 6;
  @Input() collectionSize: number = 0;
  @Input() maxSize: number = 5;
  @Input() rotate: boolean = true;
  @Input() boundaryLinks: boolean = true;
  @Input() size: 'sm' | 'lg' | null = null;
  @Input() disabled: boolean = false;

  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: number): void {
    console.log('Pagination component - page changed to:', page);
    if (page !== this.currentPage && !this.disabled) {
      // Emitir el evento al componente padre
      this.pageChange.emit(page);
    }
  }
  
  get calculatedCollectionSize(): number {
    return this.collectionSize || (this.totalPages * this.pageSize);
  }
}
