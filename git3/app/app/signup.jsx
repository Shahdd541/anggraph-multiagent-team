import "../services/firebase";
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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebase";
import { useRouter } from "expo-router";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      Alert.alert("Success", "Account created successfully!");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Signup Error", error.message);
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
        <Text style={styles.subtitle}>Create your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#666"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
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
          onPress={handleSignup}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? "Registering..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.link}>
            Already have an account? <Text style={styles.linkBold}>Login</Text>
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