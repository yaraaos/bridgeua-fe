import type { BusinessSocialLink } from "@/src/features/businesses/types/business.types";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Pressable, Text, View } from "react-native";
import { styles } from "./BusinessSocialLinksSection.styles";

type Props = {
  socialLinks?: BusinessSocialLink[];
};

const socialIcons: Record<
  BusinessSocialLink["icon"],
  keyof typeof Ionicons.glyphMap
> = {
  instagram: "logo-instagram",
  telegram: "paper-plane-outline",
  tiktok: "musical-notes-outline",
  whatsapp: "logo-whatsapp",
};

export default function BusinessSocialLinksSection({ socialLinks }: Props) {
  if (!socialLinks?.length) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Social links</Text>

      <View style={styles.chipGrid}>
        {socialLinks.map((social) => (
          <Pressable
            key={social.id}
            style={styles.chip}
            onPress={() => Linking.openURL(social.url)}
          >
            <Ionicons
              name={socialIcons[social.icon]}
              size={16}
              style={styles.chipIcon}
            />

            <Text style={styles.chipText}>{social.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}