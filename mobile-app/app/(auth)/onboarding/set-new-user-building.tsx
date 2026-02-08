import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Building = {
  id: string;
  name: string;
  address: string | null;
};

export default function SelectBuildingScreen() {
  const router = useRouter();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loadingBuildings, setLoadingBuildings] = useState(true);
  const [error, setError] = React.useState("");

  const saveBuilding = useAuthStore((s) => s.saveBuilding);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    const fetchBuildings = async () => {
      const { data, error: buildingsError } = await supabase
        .from("buildings")
        .select("*")
        .eq("active", true);

      if (!buildingsError && data) {
        if (data.length <= 0) {
          setError("No buildings found");
        }

        setBuildings(data);
      }

      if (buildingsError) {
        setError("Unable to get buildings");
      }

      setLoadingBuildings(false);
    };
    fetchBuildings();
  }, []);

  const handleContinue = async () => {
    if (!selected) {
      setError("Please select a building");
    }

    try {
      const { error: saveBuildingError } = await saveBuilding(selected);
      if (saveBuildingError) {
        setError(saveBuildingError);
        return;
      }
      router.replace("/(tabs)");
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <VStack className="flex-1 px-6 pt-4">
        {/* Header */}
        <VStack className="mb-6">
          <Heading size="2xl" className="font-bold mb-2">
            Select Your Building
          </Heading>
          <Text size="md" className="text-gray-600">
            Please select your building for tiffin delivery.
          </Text>
        </VStack>

        {error && (
          <Text size="md" className="text-error-500">
            {error}
          </Text>
        )}

        {/* List */}
        <VStack className="flex-1 gap-4">
          {loadingBuildings ? (
            <Text>Loading buildings...</Text>
          ) : (
            buildings.map((building) => (
              <BuildingCard
                key={building.id}
                building={building}
                selected={selected === building.id}
                onPress={() => {
                  setSelected(building.id);
                  if (error) setError("");
                }}
              />
            ))
          )}
        </VStack>

        {/* CTA */}
        <Button
          size="xl"
          isDisabled={!selected || loading}
          onPress={handleContinue}
          className="mb-6"
        >
          <ButtonText className="font-semibold">
            {loading ? "Saving..." : "Continue"}
          </ButtonText>
        </Button>
      </VStack>
    </SafeAreaView>
  );
}

function BuildingCard({
  building,
  selected,
  onPress,
}: {
  building: Building;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Box
        className={`p-4 rounded-xl border ${
          selected ? "border-green-800 bg-green-50" : "border-gray-200 bg-white"
        }`}
      >
        <HStack className="justify-between items-center">
          <VStack>
            <Text className="font-semibold text-base">{building.name}</Text>
            {building.address && (
              <Text className="text-gray-500 text-sm">{building.address}</Text>
            )}
          </VStack>

          <Box
            className={`w-5 h-5 rounded-full border-2 ${
              selected ? "border-green-800 bg-green-800" : "border-gray-300"
            }`}
          />
        </HStack>
      </Box>
    </Pressable>
  );
}
