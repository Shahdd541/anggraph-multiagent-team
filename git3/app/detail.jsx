import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { TMDB_TOKEN } from "../services/firebase";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    checkIfFavorite();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${TMDB_TOKEN}`,
        },
      });
      const data = await response.json();
      setMovie(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        setIsFavorite(favorites.some((fav) => fav.id.toString() === id.toString()));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

      if (isFavorite) {
        favorites = favorites.filter((fav) => fav.id.toString() !== id.toString());
        setIsFavorite(false);
        Alert.alert("Removed", "Removed from local storage cache persistence.");
      } else {
        favorites.push({ id: movie.id, title: movie.title, poster_path: movie.poster_path });
        setIsFavorite(true);
        Alert.alert("Saved", "Saved data successfully to local storage!");
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#E50914" style={styles.loader} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backNav}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={26} color="#E50914" />
        </TouchableOpacity>
      </View>

      {movie && (
        <ScrollView>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}` }}
            style={styles.backdrop}
          />
          <View style={styles.detailsContainer}>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.releaseDate}>Released: {movie.release_date}</Text>
            <Text style={styles.overviewTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview}</Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#141414" },
  loader: { flex: 1, justifyContent: "center", backgroundColor: "#141414" },
  backNav: { flexDirection: "row", justifyContent: "space-between", padding: 16, alignItems: "center" },
  backdrop: { width: "100%", height: 250, resizeMode: "cover" },
  detailsContainer: { padding: 20 },
  title: { color: "#fff", fontSize: 26, fontWeight: "bold", marginBottom: 8 },
  releaseDate: { color: "#888", fontSize: 14, marginBottom: 16 },
  overviewTitle: { color: "#E50914", fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  overview: { color: "#bbb", fontSize: 16, lineHeight: 24 },
});