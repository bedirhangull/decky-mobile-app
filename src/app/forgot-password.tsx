import { Button, FieldError, Input, Label, TextField } from 'heroui-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useCSSVariable } from 'uniwind';
import { PageProvider } from '@/src/components/PageProvider';

const forgotSchema = z.object({
  email: z.email(),
});

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const { t } = useTranslation();
  const foregroundColor = String(useCSSVariable('--foreground') ?? '#0f1a00');

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (data: ForgotForm) => {
    // TODO: send reset link
    console.log(data);
  };

  return (
    <PageProvider scrollable>

      {/* Back Button */}
      <View className="pt-2">
        <Pressable className='my-6' onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={foregroundColor} />
        </Pressable>
      </View>

      <View className="py-6 gap-8">

        {/* Logo + Header */}
        <View className="gap-4">
          <Image
            source={require('@/assets/logo.png')}
            className="h-[48px] w-[48px] rounded-xl"
            resizeMode="contain"
          />
          <View className="gap-2">
            <Text className="text-foreground text-2xl font-bold">
              {t('FORGOT_TITLE')}
            </Text>
            <Text className="text-muted text-sm leading-5">
              {t('FORGOT_DESCRIPTION')}
            </Text>
          </View>
        </View>

        {/* Email Field */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField isInvalid={!!errors.email}>
              <Label>{t('FORGOT_EMAIL_LABEL')}</Label>
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                placeholder={t('FORGOT_EMAIL_PLACEHOLDER')}
                returnKeyType="done"
                onSubmitEditing={handleSubmit(onSubmit)}
              />
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </TextField>
          )}
        />

        {/* Send Reset Link Button */}
        <Button className="bg-accent w-full" onPress={handleSubmit(onSubmit)}>
          <Button.Label
            style={{ fontWeight: 'bold' }}
            className="text-accent-foreground font-bold"
          >
            {t('FORGOT_BUTTON')}
          </Button.Label>
        </Button>


        {/* Back to Login */}
        <Pressable className="self-center" onPress={() => router.back()}>
          <Text className="text-link text-sm font-semibold">
            {t('FORGOT_BACK_TO_LOGIN')}
          </Text>
        </Pressable>

      </View>
    </PageProvider>
  );
}
