import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: undefined;
  Journal: undefined;
  JournalEntry: { entryId: string };
  Profile: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  Journal: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: RootStackScreenProps<T>['navigation'];
  route: RootStackScreenProps<T>['route'];
}; 