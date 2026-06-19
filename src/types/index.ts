import { Role, ProjectStatus } from "@prisma/client";

export interface FormData {
  // Step 1
  businessName: string;
  industry: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  // Step 2
  servicesOffered: string;
  serviceArea: string;
  targetAudience: string;
  businessDescription: string;
  // Step 3
  preferredColors: string;
  preferredStyle: string;
  competitorWebsites: string;
  websitesTheyLike: string;
  // Step 4
  featuresNeeded: string[];
  // Step 5
  files: UploadedFileData[];
}

export interface UploadedFileData {
  name: string;
  size: number;
  type: string;
  category: string;
}

export interface ProjectWithDetails {
  id: string;
  title: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    name: string | null;
    email: string;
  };
  submission: {
    businessName: string;
    industry: string;
    contactName: string;
    email: string;
    phone: string;
  } | null;
  _count: {
    files: number;
    messages: number;
  };
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  newSubmissions: number;
}

declare module "next-auth" {
  interface User {
    role: Role;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: Role;
    };
  }
}


export { Role, ProjectStatus };
