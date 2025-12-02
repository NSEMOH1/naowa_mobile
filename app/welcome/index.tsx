import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { ArrowRight } from "lucide-react-native";

const { width, height } = Dimensions.get("window");

export default function Onboarding1() {
  const handleNext = () => {
    router.push("/welcome/onboarding2");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/army.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.mainContent}>
        <Image
          source={require("../../assets/images/naowa.png")}
          style={styles.atmImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Welcome To</Text>
          <Text style={styles.title}>NAOWA Multipurpose</Text>
          <Text style={styles.title}>Cooperative Society</Text>
        </View>
        
        <View style={styles.indicators}>
          <View style={[styles.indicator, styles.activeIndicator]} />
          <View style={styles.indicator} />
          <View style={styles.indicator} />
        </View>

        <View style={styles.navigation}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <ArrowRight color="black" />
          </TouchableOpacity>
        </View>
      </View>

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
  },
  atmImage: {
    width: width * 0.8,
    height: width * 0.8,
    marginTop: 60,
  },
  bottomSection: {
    paddingBottom: 50,
    paddingHorizontal: 20,
    position: 'relative',
    zIndex: 2,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  content: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
    textAlign: "center",
        fontFamily: 'Poppins_400Regular', 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
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
    zIndex: 3,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1, 
  },
  bottomImage: {
    width: width,
    height: 140,
  },
});