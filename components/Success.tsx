import React from "react";
import {
  ImageBackground,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface SuccessScreenProps {
  message: string;
  onLoginPress: () => void;
  backgroundImage?: any;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  message,
  onLoginPress,
  backgroundImage,
}) => {
  const content = (
    <View style={styles.successOverlay}>
      <View style={styles.successContainer}>
        <View style={styles.logo}>
          <Image
            source={require("../assets/images/naowa.png")}
            style={styles.logoImage}
          />
        </View>
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>{message}</Text>

          <View style={styles.successIconContainer}>
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: "#82B921",
                  width: 8,
                  height: 8,
                  top: 20,
                  left: 30,
                },
              ]}
            />
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: "#FF6B35",
                  width: 6,
                  height: 6,
                  top: 40,
                  right: 40,
                },
              ]}
            />
            <View
              style={[
                styles.decorativeLine,
                {
                  backgroundColor: "#FF6B35",
                  top: 60,
                  right: 20,
                  transform: [{ rotate: "45deg" }],
                },
              ]}
            />
            <View
              style={[
                styles.decorativeLine,
                {
                  backgroundColor: "#FFD700",
                  bottom: 80,
                  left: 20,
                  transform: [{ rotate: "-30deg" }],
                },
              ]}
            />
            <View
              style={[
                styles.decorativeLine,
                {
                  backgroundColor: "#6B73FF",
                  bottom: 40,
                  left: 40,
                  transform: [{ rotate: "60deg" }],
                },
              ]}
            />
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: "#E6E6FA",
                  width: 12,
                  height: 12,
                  bottom: 60,
                  right: 30,
                  borderWidth: 1,
                  borderColor: "#DDD",
                },
              ]}
            />
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: "#98FB98",
                  width: 6,
                  height: 6,
                  bottom: 20,
                  left: 60,
                },
              ]}
            />
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: "#FF1493",
                  width: 8,
                  height: 8,
                  bottom: 30,
                  right: 60,
                },
              ]}
            />
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: "transparent",
                  width: 16,
                  height: 16,
                  top: 80,
                  left: 60,
                  borderWidth: 2,
                  borderColor: "#DDD",
                },
              ]}
            />
            <View
              style={[
                styles.decorativeCircle,
                {
                  backgroundColor: "transparent",
                  width: 20,
                  height: 20,
                  bottom: 100,
                  right: 50,
                  borderWidth: 2,
                  borderColor: "#E6E6FA",
                },
              ]}
            />
            <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={onLoginPress}>
            <Text style={styles.loginButtonText}>Done</Text>
            <Text style={styles.loginArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={backgroundImage}
        resizeMode="cover"
        style={styles.container}
      >
        {content}
      </ImageBackground>
    );
  }

  return <View style={styles.container}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  successOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  logo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 10,
  },
  logoImage: {
    width: 60,
    height: 80,
    resizeMode: "contain",
  },
  successCard: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    width: "90%",
    maxWidth: 400,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
    lineHeight: 24,
    fontFamily: "Poppins_400Regular",
  },
  successIconContainer: {
    position: "relative",
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    alignSelf: "center",
  },
  decorativeCircle: {
    position: "absolute",
    borderRadius: 50,
  },
  decorativeLine: {
    position: "absolute",
    width: 30,
    height: 3,
    borderRadius: 2,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#82B921",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  checkmark: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  loginButton: {
    backgroundColor: "#213400",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 10,
    fontFamily: "Poppins_400Regular",
  },
  loginArrow: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
});

export default SuccessScreen;