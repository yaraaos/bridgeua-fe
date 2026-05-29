import type { BusinessDetails } from "@/src/features/businesses/types/business.types";
import type {
  EditBusinessAboutDraft,
  EditBusinessGalleryDraft,
  EditBusinessOverviewDraft,
  EditBusinessServicesDraft,
  EditBusinessTab,
} from "@/src/features/businesses/types/editBusiness.types";

type DirtyMap = Record<EditBusinessTab, boolean>;

type BuildBusinessPreviewParams = {
  business: BusinessDetails;
  dirty: DirtyMap;
  overviewDraft: EditBusinessOverviewDraft;
  galleryDraft: EditBusinessGalleryDraft;
  servicesDraft: EditBusinessServicesDraft;
  aboutDraft: EditBusinessAboutDraft;
};

export function buildBusinessPreview({
                                       business,
                                       dirty,
                                       overviewDraft,
                                       galleryDraft,
                                       servicesDraft,
                                       aboutDraft,
                                     }: BuildBusinessPreviewParams): BusinessDetails {
  const nextBusiness: BusinessDetails = {
    ...business,
    about: {
      ...business.about,
    },
    socialLinks: {
      ...business.socialLinks,
    },
    images: [...business.images],
    services: [...business.services],
  };

  if (dirty.overview) {
    nextBusiness.name = overviewDraft.name || nextBusiness.name;
    nextBusiness.category = overviewDraft.category || nextBusiness.category;
    nextBusiness.address = overviewDraft.address || nextBusiness.address;
    nextBusiness.zipCode = overviewDraft.postalCode || nextBusiness.zipCode;
    nextBusiness.city = overviewDraft.city || nextBusiness.city;
    nextBusiness.state = overviewDraft.state || nextBusiness.state;
    nextBusiness.phone = overviewDraft.phone || nextBusiness.phone;
    nextBusiness.avatarUrl = overviewDraft.avatarUrl ?? nextBusiness.avatarUrl;
    nextBusiness.location = [overviewDraft.city, overviewDraft.state]
      .filter(Boolean)
      .join(", ") || nextBusiness.location;
    nextBusiness.socialLinks = {
      website: overviewDraft.socialLinks.website,
      instagram: overviewDraft.socialLinks.instagram,
      facebook: overviewDraft.socialLinks.facebook,
      telegram: overviewDraft.socialLinks.telegram,
      whatsapp: overviewDraft.socialLinks.whatsapp,
    };
  }

  if (dirty.gallery) {
    nextBusiness.images = galleryDraft.photos
      .filter((photo) => !galleryDraft.deletedPhotoIds.includes(photo.id))
      .map((photo, index) => ({
        id: photo.id,
        url: photo.url,
        isDefault: galleryDraft.defaultPhotoIds.includes(photo.id),
        sortOrder: index,
      }));
  }

  if (dirty.services) {
    nextBusiness.services = servicesDraft.services.map((service) => ({
      id: service.id,
      name: service.name,
      duration: service.duration,
      price: Number(service.price || 0),
    }));
  }

  if (dirty.about) {
    nextBusiness.about = {
      ...nextBusiness.about,
      description: aboutDraft.description,
      languages: aboutDraft.languages,
      amenities: aboutDraft.amenities.map((amenity) => ({
        id: amenity,
        label: amenity,
        icon: "coffee",
      })),
    };
  }

  return nextBusiness;
}
