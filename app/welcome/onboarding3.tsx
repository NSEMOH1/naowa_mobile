import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Image,
} from "react-native";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function Onboarding3() {
  const handleNext = () => {
    router.push("/auth");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/army.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.mainContent}>
        <Image
          source={require("../../assets/images/chain.png")}
          style={styles.soldierImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.content}>
          <Text style={styles.title}>
            Empowering our members through unity, trust, and service.
          </Text>
          <Text style={styles.subtitle}>
            Discipline, dedication, and prosperity for every member.
          </Text>
        </View>

        <View style={styles.indicators}>
          <View style={styles.indicator} />
          <View style={styles.indicator} />
          <View style={[styles.indicator, styles.activeIndicator]} />
        </View>

        <View style={styles.navigation}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <ArrowRight color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom overlay image */}
      <View style={styles.bottomImageContainer}>
        <Image
          source={require("../../assets/images/down.png")}
          style={styles.bottomImage}
          resizeMode="cover"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  soldierImage: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 20,
  },
  bottomSection: {
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  content: {
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 28,
        fontFamily: 'Poppins_400Regular', 
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
        fontFamily: 'Poppins_400Regular', 
  },
  indicators: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 40,
    gap: 10,
    justifyContent: "flex-end",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeIndicator: {
    backgroundColor: "white",
    width: 20,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  skipText: {
    color: "white",
    fontSize: 16,
        fontFamily: 'Poppins_400Regular', 
  },
  nextButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 3
  },
  nextIcon: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
    lineHeight: 24,
  },
  bottomImageContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, // Behind the content but above background
  },
  bottomImage: {
    width: width,
    height: 140, // Adjust height as needed
  },
});
