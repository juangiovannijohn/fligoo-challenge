import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, tap, catchError, of, filter, delay, from } from 'rxjs';
import { User, UsersListResponse, UserStoreState } from '../../../shared/interfaces/user.interface';
import { UserService } from '../services/user.service';


const initialState: UserStoreState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 6,
  searchTerm: '',
  modifiedUsers: new Map(),
  deletedUserIds: new Set()
};

@Injectable({
  providedIn: 'root'
})
export class UserStore {
    private userService = inject(UserService);
    private state$ = new BehaviorSubject<UserStoreState>(initialState);

    get users$(): Observable<User[]> {
        return this.state$.pipe(
            map(state => this.getProcessedUsers(state))
        );
    }

    get filteredUsers$(): Observable<User[]> {
        return this.state$.pipe(
            map(state => {
            const processedUsers = this.getProcessedUsers(state);
            if (!state.searchTerm) {
                return processedUsers;
            }
            const term = state.searchTerm.toLowerCase();
            return processedUsers.filter(user => 
                user.first_name.toLowerCase().includes(term) ||
                user.last_name.toLowerCase().includes(term)
            );
            })
        );
    }

    get loading$(): Observable<boolean> {
        return this.state$.pipe(map(state => state.loading));
    }

    get error$(): Observable<string | null> {
        return this.state$.pipe(map(state => state.error));
    }

    get currentPage$(): Observable<number> {
    return this.state$.pipe(map(state => state.currentPage));
    }

    public get totalPages$(): Observable<number> {
    return this.state$.pipe(map(state => state.totalPages));
    }

    get searchTerm$(): Observable<string> {
    return this.state$.pipe(map(state => state.searchTerm));
    }


    private getProcessedUsers(state: UserStoreState): User[] {
        return state.users
            .filter(user => !state.deletedUserIds.has(user.id))
            .map(user => {
            const modifiedUser = state.modifiedUsers.get(user.id);
            return modifiedUser || user;
            });
    }

    private updateState(partialState: Partial<UserStoreState>): void {
        const currentState = this.state$.value;
        this.state$.next({ ...currentState, ...partialState });
    }

    loadUsers(page: number = 1, itemsPerPage: number = 6): Observable<User[]> {
        this.updateState({ loading: true, error: null, currentPage: page, itemsPerPage });
        return this.userService.list(page, itemsPerPage).pipe(
            tap((response: UsersListResponse) => {
                this.updateState({
                    users: response.data,
                    totalPages: response.total_pages,
                    loading: false
                });
            }),
            map((response: UsersListResponse) => this.getProcessedUsers(this.state$.value)),
            catchError(error => {
                this.updateState({ loading: false, error: 'Error al cargar usuarios' });
                console.error('Error loading users:', error);
                return of([]);
            })
        );
    }

    getUserById(id: number): Observable<User | null> {
    const currentState = this.state$.value;

    if (currentState.deletedUserIds.has(id)) {
        return of(null);
    }

    const modifiedUser = currentState.modifiedUsers.get(id);
    if (modifiedUser) {
        return of(modifiedUser);
    }

    const existingUser = currentState.users.find(user => user.id === id);
    if (existingUser) {
        return of(existingUser);
    }

    return this.userService.getById(id).pipe(
        catchError(error => {
        console.error('Error loading user by id:', error);
        return of(null);
        })
    );
    }

    updateUser(id: number, updatedUser: Partial<User>): Observable<User> {
        return this.userService.update(id, updatedUser).pipe(
            filter((userUpdated : User) => userUpdated != null),
            tap((userUpdated : User) => {
                const currentState = this.state$.value;
                const newModifiedUsers = new Map(currentState.modifiedUsers);
                newModifiedUsers.set(id, {...userUpdated, id});
                this.updateState({ modifiedUsers: newModifiedUsers });
            })
        );
    }

    deleteUser(id: number): Observable<boolean> {
        const currentState = this.state$.value;
        const newDeletedUserIds = new Set(currentState.deletedUserIds);
        newDeletedUserIds.add(id);

        return this.userService.delete(id).pipe(
            map(() => {
                this.updateState({ deletedUserIds: newDeletedUserIds });
                return true;
            }),
            catchError(error => {
                return of(false);
            })
        );
    }

    createUser(userData: Omit<User, 'id'>): Observable<User> {      
        const tempId = Date.now();
        
        const defaultAvatar = userData.avatar && userData.avatar.trim() !== '' 
            ? userData.avatar 
            : `https://placehold.co/400x400?text=${userData.first_name}`;
        
        const newUser: User = {
            ...userData,
            id: tempId,
            avatar: defaultAvatar
        };

        return from(new Promise<User>(resolve => {
            setTimeout(() => {
                const currentState = this.state$.value;
                const newModifiedUsers = new Map(currentState.modifiedUsers);
                newModifiedUsers.set(tempId, newUser);
                const newUsers = [...currentState.users, newUser];
                
                this.updateState({ 
                    users: newUsers,
                    modifiedUsers: newModifiedUsers 
                });
                
                resolve(newUser);
            }, 1000);
        }));
    }

    setSearchTerm(term: string): void {
        this.updateState({ searchTerm: term });
    }

    clearSearch(): void {
        this.updateState({ searchTerm: '' });
    }

    // Método para obtener estadísticas
    getStats(): Observable<{total: number, modified: number, deleted: number}> {
        return this.state$.pipe(
            map(state => ({
                total: this.getProcessedUsers(state).length,
                modified: state.modifiedUsers.size,
                deleted: state.deletedUserIds.size
            }))
        );
    }
}