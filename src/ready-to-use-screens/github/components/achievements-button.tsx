import React, { FC } from "react";
import { View, Pressable } from "react-native";
import { Image } from "expo-image";

import PairExtraordinaireImage from "@/assets/images/misc/github/achievement-1.png";
import PullSharkImage from "@/assets/images/misc/github/achievement-2.png";
import { useRouter } from "expo-router";
import { Trophy } from "lucide-react-native";

// github-achievements-carousel-animation 🔽

type Props = {
  achievements?: string[];
  maxVisible?: number;
  size?: number;
  overlap?: number;
};

export const AchievementsButton: FC<Props> = ({
  achievements = [PairExtraordinaireImage, PullSharkImage],
  maxVisible = 3,
  size = 24,
  overlap = 8,
}) => {
  const router = useRouter();
  const visibleAchievements = achievements.slice(0, maxVisible);

  return (
    <Pressable
      className="flex-row items-center gap-2"
      onPress={() => router.push("/github/achievements")}
    >
      <Trophy size={16} color="gray" />
      <View className="flex-row items-center">
        {visibleAchievements.map((achievement, index) => (
          <View
            key={`achievement-${index}`}
            className="border border-white rounded-full"
            style={[
              {
                zIndex: index - visibleAchievements.length,
                marginLeft: index > 0 ? -overlap : 0,
              },
            ]}
          >
            <Image
              source={achievement}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
              }}
            />
          </View>
        ))}
      </View>
    </Pressable>
  );
};

// github-achievements-carousel-animation 🔼
