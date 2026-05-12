import AppTabsPills from "@/src/components/ui/AppTabsPills";
import React from "react";
import { View } from "react-native";
import { styles } from "./BusinessDetailsTabs.styles";

export type BusinessDetailsTab =
  | "overview"
  | "services"
  | "reviews"
  | "photos"
  | "about";

const BUSINESS_DETAILS_TABS = [
  { label: "Overview", value: "overview" },
  { label: "Services", value: "services" },
  { label: "Reviews", value: "reviews" },
  { label: "Photos", value: "photos" },
  { label: "About", value: "about" },
] satisfies { label: string; value: BusinessDetailsTab }[];

type Props = {
  activeTab: BusinessDetailsTab;
  onChange: (tab: BusinessDetailsTab) => void;
};

export default function BusinessDetailsTabs({ activeTab, onChange }: Props) {
  return (
    <View style={styles.container}>
      <AppTabsPills
        tabs={BUSINESS_DETAILS_TABS}
        activeTab={activeTab}
        onChange={onChange}
      />
    </View>
  );
}
