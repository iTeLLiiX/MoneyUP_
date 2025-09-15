import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  monthlyIncome: number;
  age: number;
  occupation: string;
  familyStatus: string;
  children: number;
  isPremium: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Extended onboarding data
  housing?: {
    housingType: string;
    rent: number;
    utilities: number;
    homeInsurance: number;
    otherHousing: number;
  };
  transport?: {
    transportType: string;
    fuel: number;
    carInsurance: number;
    carTax: number;
    publicTransport: number;
    maintenance: number;
  };
  insurance?: {
    healthInsurance: number;
    liabilityInsurance: number;
    disabilityInsurance: number;
    pensionInsurance: number;
    privatePension: number;
    otherInsurance: number;
  };
  digital?: {
    internet: number;
    mobile: number;
    streaming: number;
    software: number;
    cloud: number;
    gaming: number;
  };
  health?: {
    medication: number;
    dental: number;
    fitness: number;
    wellness: number;
    alternativeMedicine: number;
    otherHealth: number;
  };
  education?: {
    education: number;
    books: number;
    hobbies: number;
    restaurant: number;
    entertainment: number;
    travel: number;
  };
  goals?: {
    financialGoal: string;
    savingsGoal: number;
    timeframe: string;
  };
  bankConnection?: {
    method: 'manual' | 'bank';
    selectedBank?: string;
    connectedAccounts?: any[];
  };
}

interface AppState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  currentScreen: string;
  isInitialized: boolean;
}

interface AppActions {
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentScreen: (screen: string) => void;
  initializeApp: () => Promise<void>;
  logout: () => void;
  markOnboardingComplete: () => void;
  markPremiumUser: () => void;
}

type AppStore = AppState & AppActions;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const defaultUser: User = {
  id: '',
  name: '',
  email: '',
  monthlyIncome: 0,
  age: 0,
  occupation: '',
  familyStatus: 'single',
  children: 0,
  isPremium: false,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isLoading: false,
      error: null,
      currentScreen: 'Onboarding',
      isInitialized: false,

      // Actions
      setUser: (user: User) => {
        set({ user, error: null });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          set({ user: updatedUser });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setCurrentScreen: (screen: string) => {
        set({ currentScreen: screen });
      },

      initializeApp: async () => {
        set({ isLoading: true, error: null });

        try {
          // Load user data from localStorage
          const savedUserProfile = localStorage.getItem('moneyup-user-profile');
          const onboardingProgress = localStorage.getItem('moneyup-onboarding-progress');
          const onboardingCompleted = localStorage.getItem('moneyup-onboarding-completed') === 'true';
          const isPremium = localStorage.getItem('moneyup-premium-user') === 'true';

          if (savedUserProfile || onboardingProgress) {
            try {
              let userProfile: any = {};
              if (savedUserProfile) {
                userProfile = JSON.parse(savedUserProfile);
              }
              
              let onboardingData: any = {};
              if (onboardingProgress) {
                const progress = JSON.parse(onboardingProgress);
                onboardingData = progress.data || {};
              }

              const user: User = {
                id: `user_${Date.now()}`,
                name: userProfile.personalInfo?.name || onboardingData.personalInfo?.name || '',
                email: 'user@moneyup.app',
                monthlyIncome: userProfile.personalInfo?.monthlyIncome || onboardingData.income?.monthlyNetIncome || 0,
                age: userProfile.personalInfo?.age || onboardingData.personalInfo?.age || 0,
                occupation: userProfile.personalInfo?.occupation || onboardingData.personalInfo?.occupation || '',
                familyStatus: userProfile.personalInfo?.familyStatus || onboardingData.personalInfo?.familyStatus || 'single',
                children: userProfile.personalInfo?.children || onboardingData.personalInfo?.children || 0,
                isPremium,
                onboardingCompleted,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                // Extended onboarding data - use userProfile first, then onboardingData
                housing: userProfile.housing || onboardingData.housing,
                transport: userProfile.transport || onboardingData.transport,
                insurance: userProfile.insurance || onboardingData.insurance,
                digital: userProfile.digital || onboardingData.digital,
                health: userProfile.health || onboardingData.health,
                education: userProfile.education || onboardingData.education,
                goals: userProfile.goals || onboardingData.goals,
                bankConnection: userProfile.bankConnection || onboardingData.bankConnection,
              };

              set({ 
                user, 
                currentScreen: onboardingCompleted ? (isPremium ? 'Übersicht' : 'Payment') : 'Onboarding',
                isInitialized: true,
                isLoading: false 
              });
            } catch (error) {
              console.error('Error parsing user profile:', error);
              set({ 
                user: null, 
                currentScreen: 'Onboarding',
                isInitialized: true,
                isLoading: false 
              });
            }
          } else {
            set({ 
              user: null, 
              currentScreen: 'Onboarding',
              isInitialized: true,
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Error initializing app:', error);
          set({ 
            error: 'Failed to initialize app',
            isInitialized: true,
            isLoading: false 
          });
        }
      },

      logout: () => {
        // Clear all data
        localStorage.removeItem('moneyup-user-profile');
        localStorage.removeItem('moneyup-onboarding-completed');
        localStorage.removeItem('moneyup-premium-user');
        localStorage.removeItem('moneyup-transactions');
        localStorage.removeItem('moneyup-goals');
        localStorage.removeItem('moneyup-debts');
        localStorage.removeItem('moneyup-expenses');
        localStorage.removeItem('moneyup-settings');
        localStorage.removeItem('moneyup-payment-success');

        set({
          user: null,
          currentScreen: 'Onboarding',
          error: null,
        });
      },

      markOnboardingComplete: () => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            onboardingCompleted: true,
            updatedAt: new Date().toISOString(),
          };
          
          // Save complete user profile to localStorage
          localStorage.setItem('moneyup-user-profile', JSON.stringify({
            personalInfo: {
              name: updatedUser.name,
              age: updatedUser.age,
              occupation: updatedUser.occupation,
              familyStatus: updatedUser.familyStatus,
              children: updatedUser.children,
              monthlyIncome: updatedUser.monthlyIncome,
            },
            housing: updatedUser.housing,
            transport: updatedUser.transport,
            insurance: updatedUser.insurance,
            digital: updatedUser.digital,
            health: updatedUser.health,
            education: updatedUser.education,
            goals: updatedUser.goals,
          }));
          
          localStorage.setItem('moneyup-onboarding-completed', 'true');
          
          set({ 
            user: updatedUser,
            currentScreen: 'Payment'
          });
        }
      },

      markPremiumUser: () => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            isPremium: true,
            updatedAt: new Date().toISOString(),
          };
          
          // Save updated user profile to localStorage
          localStorage.setItem('moneyup-user-profile', JSON.stringify({
            personalInfo: {
              name: updatedUser.name,
              age: updatedUser.age,
              occupation: updatedUser.occupation,
              familyStatus: updatedUser.familyStatus,
              children: updatedUser.children,
              monthlyIncome: updatedUser.monthlyIncome,
            },
            housing: updatedUser.housing,
            transport: updatedUser.transport,
            insurance: updatedUser.insurance,
            digital: updatedUser.digital,
            health: updatedUser.health,
            education: updatedUser.education,
            goals: updatedUser.goals,
          }));
          
          localStorage.setItem('moneyup-premium-user', 'true');
          
          set({ 
            user: updatedUser,
            currentScreen: 'Übersicht'
          });
          
          // Force navigation to dashboard
          window.location.href = '/dashboard';
        }
      },
    }),
    {
      name: 'moneyup-app-store',
      partialize: (state) => ({
        user: state.user,
        currentScreen: state.currentScreen,
      }),
    }
  )
);
