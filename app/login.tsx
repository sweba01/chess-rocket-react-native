import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header - Sign up link */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Don't have an account?{" "}
          <Link href="/signup">
            <Text style={styles.signUpLink}>Sign up</Text>
          </Link>
        </Text>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/image.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Sign in to Chess Rocket</Text>
      <Text style={styles.subtitle}>
        Start your journey to chess mastery today
      </Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Google Sign In */}
        <Text style={styles.sectionLabel}>Sign in with Google:</Text>
        <TouchableOpacity style={styles.googleButton} activeOpacity={0.7}>
          <Image
            source={require("@/assets/images/google-logo-frame.png")}
            style={styles.googleIcon}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Email Sign In */}
        <Text style={styles.sectionLabel}>Or sign in with email address:</Text>

        <View style={styles.inputContainer}>
          <Image
            source={require("@/assets/images/mail-01.png")}
            style={styles.fieldIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="Email or username"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Image
            source={require("@/assets/images/password-icon.png")}
            style={styles.fieldIcon}
            resizeMode="contain"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.forgotPasswordButton}>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          activeOpacity={0.8}
          onPress={() => router.replace("/(tabs)")}
        >
          <LinearGradient
            colors={["#7B2FF2", "#B44CF0", "#E8638B", "#FF9A44"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.gradient}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Terms */}
        <Text style={styles.termsText}>
          By signing up, you agree to the{" "}
          <Text style={styles.termsLink}>Terms of Use</Text>,{" "}
          <Text style={styles.termsLink}>Privacy Notice</Text>, and{" "}
          <Text style={styles.termsLink}>Cookie Notice</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 16,
    paddingBottom: 8,
  },
  headerText: {
    fontSize: 14,
    color: "#374151",
  },
  signUpLink: {
    fontWeight: "700",
    color: "#111827",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 20,
  },
  logo: {
    width: 280,
    height: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    paddingHorizontal: 24,
    maxWidth: 460,
    width: "100%",
    alignSelf: "center",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 28,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 4,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  fieldIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    outlineStyle: "none",
  } as any,
  eyeButton: {
    padding: 4,
  },
  forgotPasswordButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    marginTop: 4,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#6B7280",
  },
  getStartedButton: {
    borderRadius: 30,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  termsText: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
  },
  termsLink: {
    color: "#7B2FF2",
    fontWeight: "500",
  },
});
