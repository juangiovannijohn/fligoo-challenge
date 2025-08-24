import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { UserStore } from 'src/app/features/users/stores/user.store';

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnDestroy {
  private userStore = inject(UserStore);
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  
  searchValue: string = '';
  
  @Input() placeholder: string = 'Buscar...';
  @Output() searchTerm: EventEmitter<string> = new EventEmitter<string>();

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300), 
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.userStore.setSearchTerm(searchTerm);
    });

    this.userStore.searchTerm$
      .pipe(takeUntil(this.destroy$))
      .subscribe(term => {
        this.searchValue = term;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearch() {
    this.searchSubject.next(this.searchValue);
  }

  onClear() {
    this.searchValue = '';
    this.searchSubject.next('');
    this.userStore.clearSearch();
  }
}
