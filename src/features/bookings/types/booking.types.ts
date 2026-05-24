export type CreateBookingPayload = {
  businessId: string;
  serviceId: string;
  specialistId: string;
  date: string;
  timeSlotId: string;
  time: string;
  customer: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  promotionId?: string;
  promoCode?: string;
};

export type Booking = CreateBookingPayload & {
  id: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
};
