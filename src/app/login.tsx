import { Button, Input, Label, TextField, FieldError } from 'heroui-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
import { useRef } from 'react';
import { router } from 'expo-router';
import { useCSSVariable } from 'uniwind';
import { PageProvider } from '@/src/components/PageProvider';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const foregroundColor = String(useCSSVariable('--foreground') ?? '#0f1a00');
  const passwordRef = useRef<TextInput>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    // TODO: auth API call
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
          <View className="gap-1">
            <Text className="text-foreground text-2xl font-bold">
              {t('LOGIN_TITLE')}
            </Text>
            <Text className="text-muted text-sm">
              {t('LOGIN_DESCRIPTION')}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="gap-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField isInvalid={!!errors.email}>
                <Label>{t('LOGIN_EMAIL_LABEL')}</Label>
                <Input
                  className="border-border focus:border-border"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder={t('LOGIN_EMAIL_PLACEHOLDER')}
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </TextField>
            )}
          />

          <View className="gap-1">
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField isInvalid={!!errors.password}>
                  <Label>{t('LOGIN_PASSWORD_LABEL')}</Label>
                  <Input
                    className="border-border focus:border-border"
                    ref={passwordRef}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry
                    placeholder={t('LOGIN_PASSWORD_PLACEHOLDER')}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                  {errors.password && (
                    <FieldError>{errors.password.message}</FieldError>
                  )}
                </TextField>
              )}
            />
            <Pressable className="self-end" onPress={() => router.push('/forgot-password')}>
              <Text className="text-link text-sm font-medium">
                {t('LOGIN_FORGOT_PASSWORD')}
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Sign In Button */}
        <Button className="bg-accent w-full" onPress={handleSubmit(onSubmit)}>
          <Button.Label
            style={{ fontWeight: 'bold' }}
            className="text-accent-foreground font-bold"
          >
            {t('LOGIN_BUTTON')}
          </Button.Label>
        </Button>

        {/* Or Divider */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 h-px bg-border" />
          <Text className="text-muted text-sm">{t('AUTH_OR')}</Text>
          <View className="flex-1 h-px bg-border" />
        </View>

        {/* Apple Button */}
        <Button className="bg-black w-full" onPress={() => {}}>
          <FontAwesome name="apple" size={22} color="white" />
          <Button.Label className="text-white font-semibold">{t('AUTH_APPLE')}</Button.Label>
        </Button>

        {/* Register Link */}
        <View className="flex-row items-center justify-center">
          <Text className="text-muted text-sm">{t('LOGIN_NO_ACCOUNT')} </Text>
            <Pressable onPress={() => router.push('/register')}>
              <Text className="text-link text-sm font-semibold">
                  {t('LOGIN_REGISTER_LINK')}
              </Text>
            </Pressable>
          </View>

      </View>
    </PageProvider>
  );
}
