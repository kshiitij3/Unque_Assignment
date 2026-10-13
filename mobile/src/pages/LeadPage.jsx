import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { COLORS } from "../theme/colors";
import LeadsList from "../components/Leadlist";
import ErrorBanner from "../components/ErrorBanner";
import ConnectionStatus from "../components/ConnectionStatus";
import useLeadFeed from "../hooks/useLeadFeed";

export default function LeadsPage() {
  const { leads, loading, refreshing, connectionStatus, error, refreshLeads } =
    useLeadFeed();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Leads</Text>
        <Text style={styles.subtitle}>Incoming leads from your connected sources</Text>
        <ConnectionStatus status={connectionStatus} />
      </View>
      <ErrorBanner message={error} />
      <LeadsList
        leads={leads}
        loading={loading}
        refreshing={refreshing}
        onRefresh={refreshLeads}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingBottom: 16 },
  title: { fontSize: 30, fontWeight: "800", color: COLORS.heading },
  subtitle: { marginTop: 6, color: COLORS.text, fontSize: 14 },
});
