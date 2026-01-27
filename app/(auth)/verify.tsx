import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Verify() {
  const router = useRouter();
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const inputRefs = React.useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = React.useState(8);

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
                Send to 6300129384
              </Text>
            </VStack>

            {/* OTP Input Boxes */}
            <HStack className="justify-between mb-8 px-2">
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
                  />
                </Box>
              ))}
            </HStack>

            {/* Resend Button */}
            <Pressable
              className="flex-row items-center gap-2 py-2 px-6 bg-gray-100 rounded-full self-start mb-3"
              disabled={timer > 0}
            >
              <Ionicons name="chatbox-outline" size={20} color="#666" />
              <Text size="md" className="text-gray-600">
                Resend in {timer}s
              </Text>
            </Pressable>

            {/* WhatsApp Button */}
            <Pressable className="flex-row items-center gap-2 py-2 px-6 bg-green-50 rounded-full self-start">
              <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
              <Text size="md" className="text-green-600 font-medium">
                Send via WhatsApp
              </Text>
            </Pressable>

            {/* Footer Text */}
            <Box className="absolute bottom-6 left-6 right-6">
              <Text size="xs" className="text-gray-500 leading-5">
                By tapping on &quot;Send via Whatsapp&quot;, you agree to
                receive important communications such as OTP and payment
                details, over Whatsapp
              </Text>
            </Box>
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
});
