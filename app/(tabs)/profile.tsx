import BusinessProfileScreen from "../profile/business";
import PersonalProfileScreen from "../profile/personal";

// temporary FE-only mock
const MOCK_ACCOUNT_TYPE = "business"; // "personal" | "business"

export default function ProfileTabScreen() {
  if (MOCK_ACCOUNT_TYPE === "business") {
    return <BusinessProfileScreen />;
  }

  return <PersonalProfileScreen />;
}
