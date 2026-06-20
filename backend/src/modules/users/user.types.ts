export interface CreateUserInput {
  name: string;
  email: string;
  primaryMobile: string;
  secondaryMobile?: string;
  aadhaar: string;
  pan: string;
  dateOfBirth: string;
  placeOfBirth: string;
  currentAddress: string;
  permanentAddress: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  isActive?: boolean;
}

export interface GetUsersQuery {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: 'active' | 'deleted' | 'all';
  sortBy?: 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}
