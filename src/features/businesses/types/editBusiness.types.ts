export type EditBusinessTab = "overview" | "gallery" | "services" | "about";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type BusinessHourEntry = {
  day: DayOfWeek;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
};

export type EditBusinessSocialLinks = {
  website: string;
  instagram: string;
  facebook: string;
  telegram: string;
  whatsapp: string;
};

export type EditBusinessOverviewDraft = {
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  socialLinks: EditBusinessSocialLinks;
  hours: BusinessHourEntry[];
};

export type UpdateBusinessOverviewPayload = {
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  socialLinks: EditBusinessSocialLinks;
  hours: BusinessHourEntry[];
};

export type ServiceCategory = "beauty";

export type ServiceLibraryItem = {
  id: string;
  name: string;
  category: ServiceCategory;
};

export type ConfiguredService = {
  id: string;
  name: string;
  duration: string;
  price: string;
};

export type EditBusinessServicesDraft = {
  services: ConfiguredService[];
};

export type UpdateBusinessServicesPayload = {
  services: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  }[];
};
