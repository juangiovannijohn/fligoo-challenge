export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  updatedAt?: string;
}

export interface UserResponse {
  data: User;
  support: Support;
}

export interface UsersListResponse {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
  support: Support;
}

interface Support {
  url: string;
  text: string;
}

export interface UserStoreState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  searchTerm: string;
  modifiedUsers: Map<number, User>; 
  deletedUserIds: Set<number>;
}
