import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { validatePhoneNumber } from "@/lib/phone-utils";
import { useAuthStore } from "@/stores/authStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const loading = useAuthStore((s) => s.loading);
  const [error, setError] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "").slice(0, 10);
    setInputValue(cleaned);

    if (error) setError("");
  };

  const handleNext = async () => {
    if (!validatePhoneNumber(inputValue)) {
      setError("Please enter a valid phone number.");
      return;
    }
    const padPhoneNo = `91${inputValue}`;

    try {
      const { error: sendOptError } = await sendOtp(padPhoneNo);

      if (sendOptError) {
        setError(sendOptError);
        return;
      }

      router.replace({
        pathname: "/(auth)/verify",
        params: { phone: padPhoneNo },
      });
    } catch (e) {
      console.log(e);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <VStack className="flex-1 px-6 pt-4">
          <HStack className="justify-between items-center mb-8">
            <Heading size="3xl" className="font-bold text-primary-500">
              Hungi
            </Heading>
            <Pressable className="flex-row items-center gap-1">
              <Ionicons name="help-circle-outline" size={22} color="#000" />
              <Text size="lg" className="font-semibold">
                Help
              </Text>
            </Pressable>
          </HStack>
          <VStack className="flex-1">
            <VStack className="mb-6">
              <Heading size="2xl" className="font-bold mb-2">
                What&apos;s your number?
              </Heading>
              <Text size="md" className="text-gray-600">
                Enter your phone number to proceed
              </Text>
            </VStack>

            <FormControl
              isInvalid={!!error}
              size="lg"
              isDisabled={false}
              isReadOnly={false}
              isRequired={false}
            >
              <Input variant="outline" size="xl" className="rounded-lg">
                <HStack className="items-center pl-3 gap-2">
                  <Text size="2xl">🇮🇳</Text>
                  <Text size="xl" bold>
                    +91
                  </Text>
                </HStack>
                <InputField
                  type="text"
                  placeholder="Enter Mobile Number"
                  value={inputValue}
                  onChangeText={handleChange}
                  keyboardType="phone-pad"
                  className="text-xl"
                  autoFocus
                  maxLength={10}
                />
              </Input>
              <FormControlError>
                <FormControlErrorText className="text-red-500">
                  {error}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>

          <VStack className="pb-6 gap-3">
            <Text size="sm" className="text-gray-600 text-center">
              By continuing, you agree to the{" "}
              <Text size="sm" className="text-blue-600">
                terms
              </Text>{" "}
              and{" "}
              <Text size="sm" className="text-blue-600">
                privacy policy
              </Text>{" "}
              of Hungi.
            </Text>
            <Button
              size="xl"
              isDisabled={inputValue.length < 10 || loading}
              onPress={handleNext}
            >
              <ButtonText className="font-semibold">
                {loading ? "Sending..." : "Next"}
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
