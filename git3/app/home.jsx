import { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TMDB_TOKEN } from "../services/firebase";

export default function HomeScreen() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchTrendingMovies(); }, []);

  const fetchTrendingMovies = async () => {
    try {
      const response = await fetch("https://api.themoviedb.org/3/trending/movie/day?language=en-US", {
        method: "GET",
        headers: { accept: "application/json", Authorization: `Bearer ${TMDB_TOKEN}` },
      });
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/logo.png")} style={styles.headerLogo} />
          <Text style={styles.headerTitle}>MoviesApp</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Ionicons name="menu-outline" size={30} color="#E50914" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#E50914" style={styles.loader} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.movieCard} onPress={() => router.push({ pathname: "/detail", params: { id: item.id } })}>
              <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }} style={styles.poster} />
              <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: "#222" },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  headerLogo: { width: 35, height: 35, borderRadius: 6, marginRight: 8 },
  headerTitle: { color: "#E50914", fontSize: 20, fontWeight: "bold" },
  loader: { flex: 1, justifyContent: "center" },
  listContent: { padding: 8 },
  movieCard: { flex: 1, margin: 8, backgroundColor: "#1e1e1e", borderRadius: 8, overflow: "hidden" },
  poster: { width: "100%", height: 220, resizeMode: "cover" },
  movieTitle: { color: "#fff", padding: 8, fontSize: 14, fontWeight: "600", textAlign: "center" },
});