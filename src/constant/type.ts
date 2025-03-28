// #region Authentication
export interface LoginResponse {
  err: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ForgotPasswordResponse {
  err: number;
  message: string;
}

export interface ResetPasswordResponse {
  err: number;
  message: string;
  data: null;
}
// #endregion

// #region Users
export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  err: number;
  message: string;
  data: User;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  err: number;
  message: string;
}
// #endregion

// #region Categories
export interface Category {
  id: number;
  name: string;
  status: "SHOW" | "HIDE";
  createdAt: string;
  updatedAt: string;
  _count?: {
    ideas: number;
  };
}

export interface CategoriesResponseData {
  categories: Category[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CategoriesResponse {
  err: number;
  message: string;
  data: CategoriesResponseData;
}
// #endregion

// #region Departments
export interface Department {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    ideas: number;
  };
}

export interface DepartmentWithIdeas extends Department {
  ideas: Array<Idea>;
}

export interface DepartmentsResponseData {
  departments: Department[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DepartmentsResponse {
  err: number;
  message: string;
  data: DepartmentsResponseData;
}

export interface DepartmentDetailResponse {
  err: number;
  message: string;
  data: DepartmentWithIdeas;
}
// #endregion

// #region Ideas
export interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  categoryId: number;
  departmentId: number;
  userId: number;
  likes: number;
  dislikes: number;
  views: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  department: Omit<Department, "_count">;
  user: User;
  comments: Comment[];
  imageSrc?: string;
}

export interface IdeasResponseData {
  ideas: Idea[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface CreateIdeaRequest {
  title: string;
  description: string;
  categoryId: number;
  departmentId: number;
  userId: number;
}

export interface IdeasResponse {
  err: number;
  message: string;
  data: IdeasResponseData;
}
export interface LikeIdeaResponse {
  err: number;
  message: string;
  data: {
    idea: Idea;
  };
}
// #endregion

export interface ErrorResponse {
  err: number;
  message: string;
  data: null;
}
