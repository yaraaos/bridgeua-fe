import { useActiveAccount } from "@/src/store/account.store";

import BusinessProfileScreen from "../profile/business";
import PersonalProfileScreen from "../profile/personal";

export default function ProfileTabScreen() {
  const account = useActiveAccount();

  if (account.kind === "business") {
    return <BusinessProfileScreen />;
  }

  return <PersonalProfileScreen />;
}
