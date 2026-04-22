import BusinessProfileScreen from "../profile/business";
import PersonalProfileScreen from "../profile/personal";

// temporary FE-only mock
const MOCK_ACCOUNT_TYPE = "personal"; // "personal" | "business"

export default function ProfileTabScreen() {
  if (MOCK_ACCOUNT_TYPE === "personal") {
    return <PersonalProfileScreen />;
  }

  return <BusinessProfileScreen />;
}
