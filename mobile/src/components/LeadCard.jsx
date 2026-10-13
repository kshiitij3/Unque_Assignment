import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";
import { formatDate } from "../utils/formDate";
export default function LeadCard({ lead }) {
  const fromMeta = lead.source === "meta";
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.name} numberOfLines={2}>
          {lead.name || "Unnamed lead"}
        </Text>
        <View style={[styles.badge, fromMeta ? styles.metaBadge : styles.testBadge]}>
          <Text style={[styles.badgeText, fromMeta && styles.metaText]}>
            {fromMeta ? "META" : "TEST"}
          </Text>
        </View>
      </View>
      <Text style={styles.info}>Email: {lead.email || "Not provided"}</Text>
      <Text style={styles.info}>Phone: {lead.phone || "Not provided"}</Text>
      <Text style={styles.date}>
        Received: {formatDate(lead.createdAt || lead.leadCreatedAt)}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  top: {flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  name: { flex: 1,
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.heading,
    marginRight: 8,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  metaBadge: { backgroundColor: COLORS.successBackground },
  testBadge: { backgroundColor: COLORS.testBackground },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.primary,
  },
  metaText: { color: COLORS.success },
  info: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },
  date: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 8,
  },
});
