export type AdminUserProfile = {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  avatarUrl: string | null;
  phoneNumber: string | null;
  dateOfBirth?: string | null;
  bio?: string | null;
  city?: string | null;
  state?: string | null;
};

export type AdminUserBusiness = {
  id: number;
  name: string;
  avatarUrl: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  cuisine?: string | null;
  category?: { id: number; name: string } | null;
};

export type AdminUser = {
  id: number;
  email: string;
  accountType: "personal" | "business";
  isEmailConfirmed: boolean;
  isAdmin: boolean;
  createdAt: string;
  profile: AdminUserProfile | null;
  businesses: AdminUserBusiness[];
};

export type AdminUsersResponse = {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
};

export type CreateUserPayload = {
  email: string;
  password: string;
  accountType: "personal" | "business";
  profileData?: Partial<AdminUserProfile>;
  businessData?: {
    businessName?: string;
    ownerName?: string;
    category?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    cuisine?: string;
  };
};

export type UpdateUserPayload = {
  email?: string;
  password?: string;
  isAdmin?: boolean;
  profileData?: Partial<AdminUserProfile>;
  businessData?: {
    businessName?: string;
    category?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    cuisine?: string;
  };
};