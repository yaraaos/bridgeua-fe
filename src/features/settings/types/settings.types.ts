export type UserSettings = {
  notifyBookingConfirmed: boolean;
  notifyBookingCancelled: boolean;
  notifyNewReview: boolean;
  notifyPromotions: boolean;
  notifySystemUpdates: boolean;
  language: 'en' | 'uk';
  notifyNewFollower?: boolean;
  notifyReviewUpvote?: boolean;
  notifyRecommendation?: boolean;
  notifyNewBookingRequest?: boolean;
  notifyTeamActivity?: boolean;
  notifyLowAvailability?: boolean;
  bookingAutoConfirm?: boolean;
  profileVisible?: boolean;
  showPriceLevel?: boolean;
};
