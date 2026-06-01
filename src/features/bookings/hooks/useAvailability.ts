import { useEffect, useState } from "react";

import { getBookingAvailability } from "../services/booking.service";

import type {
    BookingAvailabilityParams,
    BookingTimeSlot,
} from "../types/booking.types";

export const useAvailability = (params: BookingAvailabilityParams | null) => {
  const [slots, setSlots] = useState<BookingTimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const businessId = params?.businessId;
  const serviceId = params?.serviceId;
  const specialistId = params?.specialistId;
  const date = params?.date;

  useEffect(() => {
    if (!businessId || !serviceId || !specialistId || !date) {
      setSlots([]);
      return;
    }

    let isMounted = true;

    const loadAvailability = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getBookingAvailability({
          businessId,
          serviceId,
          specialistId,
          date,
        });

        if (isMounted) {
          setSlots(Array.isArray(result) ? result : []);
        }
      } catch (e) {
        if (isMounted) {
          const message =
            e instanceof Error ? e.message : "Failed to load availability.";

          setError(message);
          setSlots([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadAvailability();

    return () => {
      isMounted = false;
    };
  }, [businessId, serviceId, specialistId, date]);

  return {
    slots,
    isLoading,
    error,
  };
};