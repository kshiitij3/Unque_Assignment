import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../theme/colors";
const STATUS = {
  connecting: { text: "Connecting...", color: COLORS.warning },
  live: { text: "Live updates on", color: COLORS.success },
  reconnecting: { text: "Connection lost, retrying...", color: COLORS.warning },
  offline: { text: "Live updates unavailable", color: COLORS.danger },
};
export default function ConnectionStatus({ status }) {
  const current = STATUS[status] || STATUS.connecting;

  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: current.color }]} />
      <Text style={styles.text}>{current.text}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    color: COLORS.text,
  },
});