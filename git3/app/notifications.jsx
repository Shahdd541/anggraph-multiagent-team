import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";

// Configure how alerts should behave when triggered foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function NotificationsScreen() {
  const router = useRouter();

  const triggerTestNotification = async () => {
    // Check permission status
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const { status: askStatus } = await Notifications.requestPermissionsAsync();
      if (askStatus !== "granted") {
        Alert.alert("Permission Denied", "Enable notifications in settings.");
        return;
      }
    }

    // Schedule immediate local channel notification alert
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎬 MoviesApp Alert",
        body: "Your local test notification has been successfully triggered!",
        sound: true,
      },
      trigger: null, // null means trigger instantly
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>System Alerts</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Ionicons name="notifications-circle-outline" size={80} color="#E50914" style={styles.icon} />
        <Text style={styles.title}>Notification Configuration</Text>
        <Text style={styles.description}>
          Test your mobile layout alert pipeline below to ensure background messaging modules communicate correctly.
        </Text>

        <TouchableOpacity style={styles.button} onPress={triggerTestNotification}>
          <Text style={styles.buttonText}>Trigger Test Notification</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderColor: "#222" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  icon: { marginBottom: 16 },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  description: { color: "#888", textAlign: "center", fontSize: 15, lineHeight: 22, marginBottom: 32 },
  button: { backgroundColor: "#E50914", paddingVertical: 16, paddingHorizontal: 32, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});