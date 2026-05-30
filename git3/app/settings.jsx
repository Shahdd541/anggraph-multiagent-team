import { useState } from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";

export default function SettingsScreen() {
  const router = useRouter();
  const [isPushEnabled, setIsPushEnabled] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/");
    } catch (error) {
      Alert.alert("Error Logging Out", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings Menu</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.menuList}>
        <Text style={styles.sectionHeader}>Preferences</Text>
        
        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Dark Mode View</Text>
          <Switch value={isDarkMode} onValueChange={setIsDarkMode} trackColor={{ true: "#E50914" }} />
        </View>

        <View style={styles.menuItem}>
          <Text style={styles.menuText}>Push Alerts Hook</Text>
          <Switch value={isPushEnabled} onValueChange={setIsPushEnabled} trackColor={{ true: "#E50914" }} />
        </View>

        <Text style={styles.sectionHeader}>Account Actions</Text>

        <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/notifications")}>
          <Text style={styles.menuText}>Configure System Notifications</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
          <Text style={[styles.menuText, { color: "#E50914", fontWeight: "bold" }]}>Log Out Session</Text>
          <Ionicons name="log-out-outline" size={20} color="#E50914" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  header: { flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderColor: "#222" },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  menuList: { padding: 20 },
  sectionHeader: { color: "#E50914", fontSize: 14, fontWeight: "bold", marginVertical: 10, textTransform: "uppercase" },
  menuItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#1e1e1e", padding: 16, borderRadius: 8, marginBottom: 12 },
  menuText: { color: "#fff", fontSize: 16 },
});