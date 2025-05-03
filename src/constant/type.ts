// #region Authentication
export interface LoginResponse {
  err: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    firstTimeLogin: boolean;
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
export interface IdeaFile {
  id: string;
  fileName: string;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: string;
  anonymous: boolean;
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
  comments: CommentData[];
  files?: IdeaFile[];
  likeInd: boolean;
  dislikeInd: boolean;
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
  departmentId: number | null;
  userId: number;
  anonymous?: boolean;
  files?: string[];
}

export interface UpdateIdeaRequest {
  title: string | undefined;
  description: string | undefined;
  categoryId: number | undefined;
  departmentId: number | undefined;
  anonymous?: boolean;
  status?: string;
}

export interface IdeasResponse {
  err: number;
  message: string;
  data: IdeasResponseData;
}

export interface ProfileIdeasResponse {
  err: number;
  message: string;
  data: Idea[];
}

export interface DeleteProfileImageResponse {
  err: number;
  message: string;
  data: null
}

export interface IdeaDetailResponse {
  err: number;
  message: string;
  data: Idea;
}
export interface LikeIdeaResponse {
  err: number;
  message: string;
  data: {
    idea: Idea;
  };
}

export interface GetAllIdeasParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  departmentId?: string;
  categoryId?: string;
  status?: string;
  userId?: number;
}

export interface DeleteIdeaResponse {
  err: number;
  message: string;
  data: {
    message: string;
  };
}

export interface FileUploadData {
  fileId?: string;
  fileName?: string;
}

export interface FileUploadResponse {
  err: number;
  message: string;
  data: FileUploadData[];
}

// #endregion

// #region Comments\

export interface CommentResponse {
  err: number;
  message: string;
  data: {
    comments: CommentData[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CommentUpdateResponse {
  err: number;
  message: string;
  data: {
    id: number;
    createdAt: string;
    updatedAt: string;
    content: string;
    user: User;
  };
}
export interface CommentData {
  id: number;
  content: string;
  createdAt: string;
  anonymous: boolean;
  updatedAt: string;
  user: User;
  idea: Idea;
  isDeleting?: boolean;
}
export interface CommentRequest {
  content: string;
  isAnonymous: boolean;
  ideaId: number;
  userId: number;
}

export interface DeleteCommentResponse {
  err: number;
  message: string;
  data: {
    message: string;
  };
}
// #endregion

// #region Notifications Types
export interface Notification {
  id: number;
  type: "LIKE" | "DISLIKE" | "COMMENT";
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  fromUser: {
    id: number;
    name: string;
  };
  idea: {
    id: number;
    title: string;
  };
}

export interface NotificationsResponseData {
  notifications: Notification[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsResponse {
  err: number;
  message: string;
  data: NotificationsResponseData;
}

export interface MarkAsReadResponse {
  err: number;
  message: string;
  data: {
    message: string;
  };
}
// #endregion

//region AcademicYears Type
export interface AcademicYear {
  startDate: string;
  closureDate: string;
  finalClosureDate: string;
  year: number;
}

export interface AcademicYearsResponse {
  err: number;
  message: string;
  data: AcademicYear;
}
//end region

// #region Reports
export interface ReportIdeaRequest {
  type: string;
  detail?: string;
}

export interface Report {
  id: number;
  userId: number;
  ideaId: number;
  type: string;
  detail?: string;
  status: "SHOW" | "HIDE" | "DELETED";
  createdAt: string;
  updatedAt: string;
}

export interface ReportIdeaResponse {
  err: number;
  message: string;
  data: Report;
}
// #endregion

//region Profile
export interface ProfileResponse {
  err: number;
  message: string;
  data: Profile;
}

export interface Profile {
  email: string;
  name: string;
  profileImage: string;
  lastLoginTime: string;
  department: Department;
  currentAcademicYear: AcademicYear;
}
//end region

export interface ErrorResponse {
  err: number;
  message: string;
  data: null;
}

export interface PreviewItem {
  url: string;
  mime: string;
}
