import type { BusinessAmenity, BusinessDetails } from "@/src/features/businesses/types/business.types";
import type {
  EditBusinessAboutDraft,
  EditBusinessGalleryDraft,
  EditBusinessOverviewDraft,
  EditBusinessServicesDraft,
  EditBusinessTab,
} from "@/src/features/businesses/types/editBusiness.types";

const AMENITY_OPTIONS = [
  { id: "wifi", label: "Wi-Fi", icon: "wifi" },
  { id: "parking", label: "Parking", icon: "parking" },
  { id: "ac", label: "Air Conditioning", icon: "ac" },
  { id: "pet", label: "Pet Friendly", icon: "pet" },
  { id: "accessibility", label: "Wheelchair Accessible", icon: "accessibility" },
  { id: "coffee", label: "Coffee & Drinks", icon: "coffee" },
  { id: "tv", label: "TV", icon: "tv" },
  { id: "outdoor", label: "Outdoor Seating", icon: "outdoor" },
] as const;

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

    const hasPhoneContact = updatedContacts.some(
      (contact) => contact.type === "phone",
    );

    nextBusiness.about = {
      ...nextBusiness.about,
      contacts: overviewDraft.phone
        ? hasPhoneContact
          ? updatedContacts
          : [
              ...updatedContacts,
              {
                id: "contact-phone",
                type: "phone" as const,
                label: "Phone",
                value: overviewDraft.phone,
                actionUrl: `tel:${overviewDraft.phone}`,
              },
            ]
        : updatedContacts.filter((contact) => contact.type !== "phone"),
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
      amenities: aboutDraft.amenities.map((amenityId) => {
        const option = AMENITY_OPTIONS.find((item) => item.id === amenityId);
        return {
          id: amenityId,
          label: option?.label ?? amenityId,
          icon: (option?.icon ?? "coffee") as BusinessAmenity["icon"],
        };
      }),
    };
  }

  return nextBusiness;
}
