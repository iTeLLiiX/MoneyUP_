import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';

interface OnboardingData {
  personalInfo: {
    name: string;
    age: number;
    occupation: string;
    familyStatus: string;
    children: number;
  };
  income: {
    monthlyNetIncome: number;
  };
  housing: {
    rent: number;
    utilities: number;
    otherHousing: number;
    homeInsurance: number;
  };
  transport: {
    fuel: number;
    publicTransport: number;
    maintenance: number;
    carInsurance: number;
    carTax: number;
  };
  insurance: {
    healthInsurance: number;
    disabilityInsurance: number;
    pensionInsurance: number;
    privatePension: number;
    liabilityInsurance: number;
    otherInsurance: number;
  };
  digital: {
    internet: number;
    mobile: number;
    streaming: number;
    software: number;
    cloud: number;
    gaming: number;
  };
  health: {
    medication: number;
    fitness: number;
    wellness: number;
    alternativeMedicine: number;
    dental: number;
    otherHealth: number;
  };
  education: {
    education: number;
    books: number;
    hobbies: number;
    restaurant: number;
    entertainment: number;
    travel: number;
  };
  goals: {
    financialGoal: string;
    savingsGoal: number;
    timeframe: string;
  };
}

const OnboardingScreen: React.FC = () => {
  const { markOnboardingComplete } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    personalInfo: {
      name: '',
      age: 0,
      occupation: '',
      familyStatus: 'single',
      children: 0,
    },
    income: {
      monthlyNetIncome: 0,
    },
    housing: {
      rent: 0,
      utilities: 0,
      otherHousing: 0,
      homeInsurance: 0,
    },
    transport: {
      fuel: 0,
      publicTransport: 0,
      maintenance: 0,
      carInsurance: 0,
      carTax: 0,
    },
    insurance: {
      healthInsurance: 0,
      disabilityInsurance: 0,
      pensionInsurance: 0,
      privatePension: 0,
      liabilityInsurance: 0,
      otherInsurance: 0,
    },
    digital: {
      internet: 0,
      mobile: 0,
      streaming: 0,
      software: 0,
      cloud: 0,
      gaming: 0,
    },
    health: {
      medication: 0,
      fitness: 0,
      wellness: 0,
      alternativeMedicine: 0,
      dental: 0,
      otherHealth: 0,
    },
    education: {
      education: 0,
      books: 0,
      hobbies: 0,
      restaurant: 0,
      entertainment: 0,
      travel: 0,
    },
    goals: {
      financialGoal: '',
      savingsGoal: 0,
      timeframe: '',
    },
  });

  const totalSteps = 10;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save onboarding data
      await markOnboardingComplete();
      Alert.alert('Erfolg', 'Onboarding abgeschlossen!');
    } catch (error) {
      Alert.alert('Fehler', 'Fehler beim Speichern der Daten');
    }
  };

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Willkommen bei MoneyUP! 💵</Text>
            <Text style={styles.stepDescription}>
              Lassen Sie uns gemeinsam Ihre Finanzen optimieren. 
              Wir führen Sie durch ein kurzes Setup.
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Ihr Name</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.personalInfo.name}
                onChangeText={(value) => updateData('personalInfo', 'name', value)}
                placeholder="Max Mustermann"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Persönliche Informationen 👤</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Alter</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.personalInfo.age.toString()}
                onChangeText={(value) => updateData('personalInfo', 'age', parseInt(value) || 0)}
                placeholder="25"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Beruf</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.personalInfo.occupation}
                onChangeText={(value) => updateData('personalInfo', 'occupation', value)}
                placeholder="Softwareentwickler"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Einkommen 💰</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Monatliches Nettoeinkommen (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.income.monthlyNetIncome.toString()}
                onChangeText={(value) => updateData('income', 'monthlyNetIncome', parseFloat(value) || 0)}
                placeholder="2500"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Wohnkosten 🏠</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Miete (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.housing.rent.toString()}
                onChangeText={(value) => updateData('housing', 'rent', parseFloat(value) || 0)}
                placeholder="800"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nebenkosten (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.housing.utilities.toString()}
                onChangeText={(value) => updateData('housing', 'utilities', parseFloat(value) || 0)}
                placeholder="200"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Transportkosten 🚗</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Kraftstoff (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.transport.fuel.toString()}
                onChangeText={(value) => updateData('transport', 'fuel', parseFloat(value) || 0)}
                placeholder="120"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Öffentliche Verkehrsmittel (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.transport.publicTransport.toString()}
                onChangeText={(value) => updateData('transport', 'publicTransport', parseFloat(value) || 0)}
                placeholder="80"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Versicherungen 🛡️</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Krankenversicherung (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.insurance.healthInsurance.toString()}
                onChangeText={(value) => updateData('insurance', 'healthInsurance', parseFloat(value) || 0)}
                placeholder="300"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Haftpflichtversicherung (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.insurance.liabilityInsurance.toString()}
                onChangeText={(value) => updateData('insurance', 'liabilityInsurance', parseFloat(value) || 0)}
                placeholder="10"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 7:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Digitale Services 💻</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Internet & Handy (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.digital.internet.toString()}
                onChangeText={(value) => updateData('digital', 'internet', parseFloat(value) || 0)}
                placeholder="80"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Streaming & Software (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.digital.streaming.toString()}
                onChangeText={(value) => updateData('digital', 'streaming', parseFloat(value) || 0)}
                placeholder="30"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 8:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Gesundheit & Fitness 💪</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Fitnessstudio (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.health.fitness.toString()}
                onChangeText={(value) => updateData('health', 'fitness', parseFloat(value) || 0)}
                placeholder="50"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Medikamente (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.health.medication.toString()}
                onChangeText={(value) => updateData('health', 'medication', parseFloat(value) || 0)}
                placeholder="25"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 9:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Freizeit & Bildung 📚</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Restaurant & Unterhaltung (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.education.restaurant.toString()}
                onChangeText={(value) => updateData('education', 'restaurant', parseFloat(value) || 0)}
                placeholder="150"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Bildung & Hobbys (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.education.education.toString()}
                onChangeText={(value) => updateData('education', 'education', parseFloat(value) || 0)}
                placeholder="50"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 10:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Finanzielle Ziele 🎯</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Sparziel (€)</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.goals.savingsGoal.toString()}
                onChangeText={(value) => updateData('goals', 'savingsGoal', parseFloat(value) || 0)}
                placeholder="500"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Zeitrahmen</Text>
              <TextInput
                style={styles.textInput}
                value={onboardingData.goals.timeframe}
                onChangeText={(value) => updateData('goals', 'timeframe', value)}
                placeholder="12 Monate"
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          Schritt {currentStep} von {totalSteps}
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(currentStep / totalSteps) * 100}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {renderStep()}
      </ScrollView>

      <View style={styles.footer}>
        {currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
            <Text style={styles.backButtonText}>Zurück</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? 'Abschließen' : 'Weiter'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#10b981',
  },
  progressText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  nextButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default OnboardingScreen;