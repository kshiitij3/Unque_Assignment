import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";
export default function EmptyState({ title, message }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>{title || "No leads yet"}</Text>
      <Text style={styles.message}>
        {message || "New leads will show up here."}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  box: { alignItems: "center",
    padding: 32,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.heading,
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    color: COLORS.text,
  },
});
