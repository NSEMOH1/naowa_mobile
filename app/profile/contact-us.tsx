import React from "react";
import { 
  Text, 
  StyleSheet, 
  View, 
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ContactUs = () => {
  const handleCallUs = () => {
    Linking.openURL('tel:+2348012345678').catch((err) => {
      Alert.alert("Error", "Unable to make call");
    });
  };

  const handleWhatsApp = () => {
    const whatsappUrl = "whatsapp://send?phone=2348012345678&text=Hello, I need assistance";
    Linking.openURL(whatsappUrl).catch(() => {
      Linking.openURL('https://wa.me/2348012345678?text=Hello, I need assistance');
    });
  };

  const handleFAQ = () => {
    console.log("Navigate to FAQ screen");
  };

  const handleContinue = () => {
    console.log("Continue pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Contact us</Text>
        <Text style={styles.subtitle}>
          Call or Chat with us and we will answer any question.
        </Text>

        <TouchableOpacity style={styles.contactButton} onPress={handleCallUs}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📞</Text>
          </View>
          <Text style={styles.contactText}>Call us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>💬</Text>
          </View>
          <Text style={styles.contactText}>Get on Whatsapp</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactButton} onPress={handleFAQ}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>❓</Text>
          </View>
          <Text style={styles.contactText}>FAQ</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

export default ContactUs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginTop: 40,
    fontFamily: 'Poppins_400Regular', 
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 40,
    fontFamily: 'Poppins_400Regular', 
  },
  contactButton: {
    backgroundColor: "#F5F7F0",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular', 
  },
  contactText: {
    fontSize: 16,
    color: "#4A5D23",
    fontWeight: "500",
    fontFamily: 'Poppins_400Regular', 
  },
  continueButton: {
    backgroundColor: "#982323",
    margin: 20,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    fontFamily: 'Poppins_400Regular', 
  },
});