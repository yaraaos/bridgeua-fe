import AppTabsPills from "@/src/components/ui/AppTabsPills";
import React from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { styles } from "./BusinessDetailsTabs.styles";

export type BusinessDetailsTab =
  | "overview"
  | "services"
  | "reviews"
  | "photos"
  | "about";

type Props = {
  activeTab: BusinessDetailsTab;
  onChange: (tab: BusinessDetailsTab) => void;
};

export default function BusinessDetailsTabs({ activeTab, onChange }: Props) {
  const { t } = useTranslation();

  const tabs = [
    { label: t("business.tabOverview"), value: "overview" as const },
    { label: t("business.tabServices"), value: "services" as const },
    { label: t("business.tabReviews"), value: "reviews" as const },
    { label: t("business.tabPhotos"), value: "photos" as const },
    { label: t("business.tabAbout"), value: "about" as const },
  ] satisfies { label: string; value: BusinessDetailsTab }[];

  return (
    <View style={styles.container}>
      <AppTabsPills
        tabs={tabs}
        activeTab={activeTab}
        onChange={onChange}
      />
    </View>
  );
}
