export interface OrganizationUsage {
  storage: OrganizationStorageUsage;
  api: OrganizationApiUsage;
}

export interface OrganizationStorageUsage {
  name: string;
  size: number;
  max: number;
  projects: ProjectUsage[];
}

export interface OrganizationApiUsage {
  price: number;
  quantity: number;
  nextInvoiceDate: number | null;
}

export interface ProjectUsage {
  name: string;
  size: number;
  max: number;
}
