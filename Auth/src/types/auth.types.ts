export interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isDefault?: boolean;
}

export interface IUser {
  username: string;
  email: string;
  password?: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  role: "user" | "seller";
  profilePic?: string;
  addresses?: IAddress[];
}
