import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, useCallback, useEffect, useState } from 'react';

import { httpClient } from '../services/httpClient';
import { useRouter } from 'expo-router';

type User = {
  email: string;
  name: string;
  id: string;
  calories: number;
  proteins: number;
  carbohydrates: number;
  fats: number;
};

type SignInParams = {
  email: string;
  password: string;
};

type SignUpParams = {
  goal: string;
  gender: string;
  birthDate: string;
  activityLevel: number;
  height: number;
  weight: number;
  account: {
    name: string;
    email: string;
    password: string;
  };
};

interface IAuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  signIn(params: SignInParams): Promise<void>;
  signUp(params: SignUpParams): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext({} as IAuthContextValue);

const TOKEN_STORAGE_KEY = process.env.EXPO_PUBLIC_TOKEN_STORAGE_KEY;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const data = await AsyncStorage.getItem(TOKEN_STORAGE_KEY!);

      setToken(data);
      setIsLoadingToken(false);
    }

    load();
  }, []);

  useEffect(() => {
    async function run() {
      if (!token) {
        httpClient.defaults.headers.common['Authorization'] = null;
        return;
      }

      httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY!, token);
    }

    run();
  }, [token]);

  const { mutateAsync: signIn } = useMutation({
    mutationFn: async (params: SignInParams) => {
      const { data } = await httpClient.post('/signin', params);
      setToken(data.accessToken);
    },
  });

  const { mutateAsync: signUp } = useMutation({
    mutationFn: async (params: SignUpParams) => {
      const { data } = await httpClient.post('/signup', params);
      setToken(data.accessToken);
    },
  });

  const { data: user, isFetching } = useQuery({
    enabled: !!token,
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await httpClient.get<{ user: User }>('/me');
      const { user } = data;

      return user;
    },
  });

  const signOut = useCallback(async () => {
    // Limpa token salvo e cabeçalhos
    setToken(null);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY!);

    // Remove todos os dados armazenados em cache (incluindo o usuário)
    queryClient.clear();

    // Navega para a tela de login substituindo a rota atual
    router.replace('/signin');
  }, [queryClient, router]);

  return (
    <AuthContext.Provider
      value={{
        // Consideramos logado se existir token válido
        isLoggedIn: !!token,
        isLoading: isLoadingToken || isFetching,
        user: user ?? null,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
