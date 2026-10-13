import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";
export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  box: {    backgroundColor: COLORS.errorBackground,
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  title: {   fontWeight: "700",
    color: COLORS.danger,
    marginBottom: 4,
  },
  message: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.text,
  },
});
