import { useMemo } from "react";
import { useLocalSearchParams } from "expo-router";

export const useBookingFlow = () => {
  const params = useLocalSearchParams<{
    businessId?: string;
    serviceId?: string;
    serviceName?: string;
    specialistId?: string;
    specialistName?: string;
    price?: string;
    date?: string;
    timeSlotId?: string;
    time?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    promotionId?: string;
    promoCode?: string;
  }>();

  const canCreateBooking = useMemo(() => {
    return (
      !!params.businessId &&
      !!params.serviceId &&
      !!params.specialistId &&
      !!params.date &&
      !!params.timeSlotId &&
      !!params.time &&
      !!params.firstName &&
      !!params.lastName &&
      !!params.phoneNumber
    );
  }, [params]);

  return {
    params,
    canCreateBooking,
  };
};