import PageProvider from "@/src/components/page-provider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { ImageProps } from "expo-image/build/Image.types";
import { router } from "expo-router";
import { Avatar, Button } from "heroui-native";
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import {
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import Animated, {
    FadeIn,
    FadeOut,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from "react-native-reanimated";
import { withUniwind } from "uniwind";

const StyledIcon = withUniwind(Ionicons);

interface Offer {
    id: number;
    about: string;
    label: string;
    image: ImageProps['source'];
}

interface Feature {
    id: number;
    title: string;
    description: string;
    iconName: keyof typeof Ionicons.glyphMap;
}

export default function OnboardingPaywall() {

    const { t } = useTranslation();

    const OFFERS_IMAGES: Offer[] = [
        {
            id: 1,
            about: 'stamps',
            label: t("offerPaywall.imageLabels.stamps"),
            image: require("./assets/offer_paywall_1.png")
        },
        {
            id: 2,
            about: 'mailboxess',
            label: t("offerPaywall.imageLabels.mailboxess"),
            image: require("./assets/offer_paywall_2.png")
        },
        {
            id: 3,
            about: 'envelopes',
            label: t("offerPaywall.imageLabels.envelopes"),
            image: require("./assets/offer_paywall_3.png")
        },
        {
            id: 4,
            about: 'make_friends',
            label: t("offerPaywall.imageLabels.make_friends"),
            image: require("./assets/offer_paywall_4.png")
        }
    ];

    const users = [
        { id: 1, image: require("@/assets/avatars/avatar1.png"), name: 'John Doe' },
        { id: 5, image: require("@/assets/avatars/avatar5.png"), name: 'Bob Johnson' },
        { id: 6, image: require("@/assets/avatars/avatar6.png"), name: 'Alice Johnson' },
        { id: 7, image: require("@/assets/avatars/avatar7.png"), name: 'Bob Johnson' },
    ];

    const FEATURES: Feature[] = [
        {
            id: 1,
            title: t("offerPaywall.featureLabels.unlock_stamps"),
            description: t("offerPaywall.featureDescriptions.unlock_stamps"),
            iconName: "grid-outline"
        },
        {
            id: 2,
            title: t("offerPaywall.featureLabels.unlock_card_postals"),
            description: t("offerPaywall.featureDescriptions.unlock_card_postals"),
            iconName: "card-outline"
        },
        {
            id: 3,
            title: t("offerPaywall.featureLabels.unlock_envelopes"),
            description: t("offerPaywall.featureDescriptions.unlock_envelopes"),
            iconName: "mail-open-outline"
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const [timeLeft, setTimeLeft] = useState(1800);
    const opacity = useSharedValue(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % OFFERS_IMAGES.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        opacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const currentOffer = OFFERS_IMAGES[currentIndex];

    const pulseStyle = useAnimatedStyle(() => ({
        opacity: opacity.value
    }));

    //between 75- 124
    const generateRandomNumber = () => {
        return Math.floor(Math.random() * (124 - 75 + 1)) + 75;
    };

    const handleClose = () => {
        router.replace("/(tabs)/home")
    }

    return (
        <PageProvider>
            <ScrollView contentContainerClassName="pb-12" showsVerticalScrollIndicator={false}>
                <View>
                    <Pressable onPress={handleClose} className="absolute top-4 right-4 opacity-60 z-50">
                        <StyledIcon name="close" size={24} />
                    </Pressable>
                    <View className="relative mt-6 mb-8">
                        <View className="h-12 w-full z-20 absolute -top-4 left-0">
                            {OFFERS_IMAGES.map((offer) => (
                                <Animated.View
                                    key={`text-${offer.id}`}
                                    entering={FadeIn.duration(600)}
                                    exiting={FadeOut.duration(600)}
                                    className="absolute"
                                    style={{ display: offer.id === currentOffer.id ? 'flex' : 'none' }}
                                >
                                    <Text className="font-hand-caveat text-4xl -rotate-12 bg-background/80">
                                        {offer.label}
                                    </Text>
                                </Animated.View>
                            ))}
                        </View>

                        <View className="w-full h-[220px] items-center justify-center relative">
                            {OFFERS_IMAGES.map((offer) => (
                                <Animated.View
                                    key={`img-${offer.id}`}
                                    entering={FadeIn.duration(800)}
                                    exiting={FadeOut.duration(800)}
                                    className="absolute w-full h-full items-center justify-center"
                                    style={{ display: offer.id === currentOffer.id ? 'flex' : 'none' }}
                                >
                                    <Image
                                        source={offer.image}
                                        style={{ width: 300, height: 200 }}
                                        contentFit="contain"
                                    />
                                </Animated.View>
                            ))}
                        </View>
                    </View>

                    <View className="mb-4">
                        <Text className="text-4xl font-bold text-center text-foreground mb-2">
                            {t("offerPaywall.title")}
                        </Text>
                        <Text className="text-center text-lg text-foreground/80">
                            {t("offerPaywall.description")}
                        </Text>
                    </View>

                    {/* Timer Counting */}
                    <View className="mb-6">
                        <Animated.View
                            style={pulseStyle}
                            className="flex-row items-center justify-center gap-2 bg-red-500/10 px-6 py-4 rounded-full border border-red-500/20"
                        >
                            <StyledIcon name="timer-outline" size={20} className="text-red-500" />
                            <Text className="text-red-500 font-bold text-2xl" style={{ fontVariant: ['tabular-nums'] }}>
                                {t("offerPaywall.timerText")} {formatTime(timeLeft)}
                            </Text>
                        </Animated.View>
                        <View className="mt-4">
                            <Text className="text-center text-lg">
                                {t("offerPaywall.onlyText")} <Text className="line-through text-foreground/40">$7.99</Text> <Text className="font-bold text-primary">$1.99</Text> / month
                            </Text>
                        </View>
                    </View>

                    <View className="bg-transparent gap-8 mt-4">
                        {
                            FEATURES.map((feature) => (
                                <View
                                    className="flex flex-row items-center gap-4 bg-transparent"
                                    key={feature.id}>
                                    <View className="w-12 h-12 rounded-full items-center justify-center bg-accent">
                                        <StyledIcon name={feature.iconName} size={24} color="white" />
                                    </View>
                                    <View>
                                        <Text className="text-xl font-bold">{feature.title}</Text>
                                        <Text className="text-foreground/80">{feature.description}</Text>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </View>
            </ScrollView>
            <View className="border-0 border-t border-t-foreground/20">
                <View className="flex-row items-center justify-center my-4">
                    {users.map((user, index) => (
                        <Avatar
                            alt="user"
                            key={user.id}
                            size="sm"
                            color="accent"
                            className={`border border-foreground/25 ${index !== 0 ? '-ml-4' : ''}`}
                            style={{
                                borderRadius: 32,
                                zIndex: users.length - index
                            }}
                        >
                            <Avatar.Image source={user.image} />
                        </Avatar>
                    ))}
                    <Text className="font-bold ml-2">{generateRandomNumber()}+ {t("offerPaywall.usersText")}</Text>
                </View>
                <Button size="lg">
                    <Button.Label className="font-bold text-xl">{t("offerPaywall.buttonText")}</Button.Label>
                </Button>
                <Text className="text-center text-sm mt-4 text-foreground/80">{t("offerPaywall.cancel")}</Text>
            </View>
        </PageProvider >
    );
}