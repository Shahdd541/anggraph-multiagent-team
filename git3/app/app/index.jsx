import "../services/firebase"; // Force configuration execution early
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <Text style={styles.title}>MoviesApp</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Signing in..." : "Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text style={styles.link}>
            Don't have an account? <Text style={styles.linkBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#141414", justifyContent: "center", padding: 28 },
  logo: { width: 90, height: 90, alignSelf: "center", marginBottom: 16, borderRadius: 18 },
  title: { color: "#E50914", fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 4 },
  subtitle: { color: "#888", textAlign: "center", marginBottom: 36, fontSize: 14 },
  input: { backgroundColor: "#1e1e1e", color: "#fff", padding: 15, borderRadius: 10, marginBottom: 14, borderWidth: 1, borderColor: "#2e2e2e", fontSize: 15 },
  button: { backgroundColor: "#E50914", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 20, marginTop: 4 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#888", textAlign: "center", fontSize: 14 },
  linkBold: { color: "#E50914", fontWeight: "bold" },
});