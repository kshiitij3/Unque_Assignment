import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import LeadCard from "./LeadCard";
import EmptyState from "./EmptyState";
import { COLORS } from "../theme/colors";
import { getLeadKey } from "../utils/mergeLeads";
export default function LeadsList({ leads, loading, refreshing, onRefresh }) {
  // first load, nothing to show yet
  if (loading && leads.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading leads...</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={leads}
      keyExtractor={getLeadKey}
      renderItem={({ item }) => <LeadCard lead={item} />}
      contentContainerStyle={leads.length ? styles.list : styles.emptyList}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      ListEmptyComponent={
        <EmptyState message="Keep this screen open. New leads will appear here when the backend gets them." />
      }
    />
  );
}
const styles = StyleSheet.create({
  list: { paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.text,
  },
});
