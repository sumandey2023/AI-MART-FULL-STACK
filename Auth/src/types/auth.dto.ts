export interface RegisterUserBody {
  username: string;
  email: string;
  password: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  role?: "user" | "seller" | "admin";
}

export interface LoginUserBody {
  email?: string;
  username?: string;
  password: string;
}

export interface AddressBody {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}
