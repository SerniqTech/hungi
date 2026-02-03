import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { formatIndianPhone } from "@/lib/phone-utils";
import { useAuthStore } from "@/stores/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyScreen() {
  const initialOtp = ["", "", "", "", "", ""];
  const router = useRouter();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const loading = useAuthStore((s) => s.loading);
  const [otp, setOtp] = useState(initialOtp);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = async (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "") && !loading) {
      const token = newOtp.join("");

      const { error: verifyOtpError } = await verifyOtp(phone, token);

      if (verifyOtpError) {
        setError(verifyOtpError);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setOtp(initialOtp);
    setError("");
    inputRefs.current[0]?.focus();
    try {
      const { error: sendOtpError } = await sendOtp(phone);

      if (sendOtpError) {
        setError(sendOtpError);
        return;
      }
      setTimer(30);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
  };

  const isResendEnabled = timer === 0 && !loading;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <VStack className="flex-1">
          <HStack className="items-center px-6 py-4">
            <Pressable onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Pressable>
            <Heading size="xl" className="flex-1 font-bold">
              Verify OTP
            </Heading>
            <Pressable className="flex-row items-center gap-1">
              <Ionicons name="help-circle-outline" size={22} color="#000" />
              <Text size="lg" className="font-semibold">
                Help
              </Text>
            </Pressable>
          </HStack>

          {/* Main Content */}
          <VStack className="flex-1 px-6 pt-6">
            <VStack className="mb-8">
              <Heading size="2xl" className="font-bold mb-2">
                Enter verification code
              </Heading>
              <Text size="md" className="text-gray-500">
                Send to {formatIndianPhone(phone)}
              </Text>
            </VStack>

            {/* OTP Input Boxes */}
            <HStack className="justify-between mb-6 px-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Box key={index}>
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.otpInput}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={otp[index]}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    textAlign="center"
                    autoFocus={index === 0}
                    editable={!loading}
                  />
                </Box>
              ))}
            </HStack>
            {error && <Text className="text-error-500">{error}</Text>}

            {/* Resend Button */}
            <Pressable
              className={`flex-row items-center gap-2 py-2 px-4 rounded-full self-start mb-3 ${
                isResendEnabled ? "bg-blue-100" : "bg-gray-100"
              }`}
              disabled={!isResendEnabled}
              onPress={handleResendOtp}
            >
              <Ionicons
                name="chatbox-outline"
                size={20}
                color={isResendEnabled ? "#2563EB" : "#666"}
              />
              <Text
                size="md"
                className={isResendEnabled ? "text-blue-600" : "text-gray-600"}
              >
                {isResendEnabled ? "Resend OTP" : `Resend in ${timer}s`}
              </Text>
            </Pressable>

            {loading && (
              <View style={styles.overlay}>
                <ActivityIndicator size="large" />
              </View>
            )}
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  otpInput: {
    width: 50,
    height: 50,
    fontSize: 24,
    fontWeight: "600",
    color: "#000",
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
