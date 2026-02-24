export type User = {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  users: User[];
};

export type UserResponse = {
  user: User;
};
