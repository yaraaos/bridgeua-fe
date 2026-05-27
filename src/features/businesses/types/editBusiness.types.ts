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
  avatarUrl?: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  phone: string;
  socialLinks: EditBusinessSocialLinks;
  hours: BusinessHourEntry[];
};

export type UpdateBusinessOverviewPayload = {
  name: string;
  category: string;
  avatarUrl?: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  phone: string;
  socialLinks: EditBusinessSocialLinks;
  hours: BusinessHourEntry[];
};

export type ServiceLibraryItem = {
  serviceId: string;
  categoryId: string;
  name: string;
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
    serviceId: string;
    durationMinutes: number;
    price: number;
  }[];
};

export type EditBusinessAboutDraft = {
  description: string;
  languages: string[];
  amenities: string[];
};

export type UpdateBusinessAboutPayload = {
  description: string;
  languages: string[];
  amenities: string[];
};

export type GalleryPhoto = {
  id: string;
  url: string;
  isLocal: boolean;
};

export type EditBusinessGalleryDraft = {
  photos: GalleryPhoto[];
  defaultPhotoIds: string[];
  deletedPhotoIds: string[];
};
