import type { BusinessAmenity, BusinessDetails } from "@/src/features/businesses/types/business.types";
import type {
  EditBusinessAboutDraft,
  EditBusinessGalleryDraft,
  EditBusinessOverviewDraft,
  EditBusinessServicesDraft,
  EditBusinessTab,
} from "@/src/features/businesses/types/editBusiness.types";

const AMENITY_LABELS: Record<string, string> = {
  wifi: "Wi-Fi",
  parking: "Parking",
  ac: "Air Conditioning",
  pet: "Pet Friendly",
  accessibility: "Wheelchair Accessible",
  coffee: "Coffee & Drinks",
  tv: "TV",
  outdoor: "Outdoor Seating",
};

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

    // Update about.contacts so BusinessOverviewCard reflects draft changes
    const hasPhoneContact = nextBusiness.about.contacts.some((c) => c.type === 'phone');
    const updatedContacts = nextBusiness.about.contacts.map((contact) => {
      if (contact.type === 'address' && overviewDraft.address) {
        const fullAddress = [
          overviewDraft.address,
          overviewDraft.city,
          overviewDraft.state,
          overviewDraft.postalCode,
        ].filter(Boolean).join(', ');
        return {
          ...contact,
          value: fullAddress,
          actionUrl: `https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`,
        };
      }
      if (contact.type === 'phone' && overviewDraft.phone) {
        return {
          ...contact,
          value: overviewDraft.phone,
          actionUrl: `tel:${overviewDraft.phone}`,
        };
      }
      return contact;
    });
    if (!hasPhoneContact && overviewDraft.phone) {
      updatedContacts.push({
        id: 'phone',
        type: 'phone',
        label: 'Phone',
        value: overviewDraft.phone,
        actionUrl: `tel:${overviewDraft.phone}`,
      });
    }
    nextBusiness.about = {
      ...nextBusiness.about,
      contacts: updatedContacts,
    };

    // Update opening hours from draft
    if (overviewDraft.hours?.length) {
      nextBusiness.about = {
        ...nextBusiness.about,
        openingHours: overviewDraft.hours.map((h) => ({
          id: h.day,
          day: h.day.charAt(0).toUpperCase() + h.day.slice(1),
          hours: h.isOpen
            ? `${h.openTime} – ${h.closeTime}`
            : 'Closed',
          isClosed: !h.isOpen,
        })),
        isOpen: overviewDraft.hours.some((h) => {
          if (!h.isOpen) return false;
          const now = new Date();
          const day = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][now.getDay()];
          if (h.day !== day) return false;
          const [openH, openM] = h.openTime.split(':').map(Number);
          const [closeH, closeM] = h.closeTime.split(':').map(Number);
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          return currentMinutes >= openH * 60 + openM && currentMinutes < closeH * 60 + closeM;
        }),
      };
    }
  }

  if (dirty.gallery) {
    nextBusiness.images = galleryDraft.photos
      .filter((photo) => !galleryDraft.deletedPhotoIds.includes(photo.id))
      .map((photo, index) => ({
        id: photo.id,
        url: photo.url,
        isDefault: galleryDraft.defaultPhotoIds.includes(photo.id),
        sortOrder: galleryDraft.defaultPhotoIds.includes(photo.id) ? -1 : index,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  if (dirty.services) {
    nextBusiness.services = servicesDraft.services.map((service) => ({
      id: service.id,
      name: service.name,
      duration: service.duration,
      price: Number(service.price || 0),
      priceFrom: service.price ? `$${service.price}` : undefined,
    }));
  }

  if (dirty.about) {
    nextBusiness.about = {
      ...nextBusiness.about,
      description: aboutDraft.description,
      languages: aboutDraft.languages,
      amenities: aboutDraft.amenities.map((id) => ({
        id,
        label: AMENITY_LABELS[id] ?? id,
        icon: id as BusinessAmenity["icon"],
      })),
    };
  }

  return nextBusiness;
}
