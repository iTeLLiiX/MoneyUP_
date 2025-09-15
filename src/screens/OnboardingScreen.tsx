import React, { useState } from 'react';
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

  const handleComplete = () => {
    // Save complete user profile
    const userProfile = {
      personalInfo: onboardingData.personalInfo,
      income: onboardingData.income,
      housing: onboardingData.housing,
      transport: onboardingData.transport,
      insurance: onboardingData.insurance,
      digital: onboardingData.digital,
      health: onboardingData.health,
      education: onboardingData.education,
      goals: onboardingData.goals,
      onboardingCompleted: true,
      completedAt: new Date().toISOString()
    };

    localStorage.setItem('moneyup-user-profile', JSON.stringify(userProfile));
    localStorage.setItem('moneyup-onboarding-completed', 'true');

    markOnboardingComplete();
    
    // Navigate to payment screen
    window.location.href = '/payment';
  };

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setOnboardingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="onboarding-step">
            <div className="step-header">
              <img src="/MoneyUP.png" alt="MoneyUP" className="logo" />
              <h1>Willkommen bei MoneyUP</h1>
              <p>Ihr persönlicher Finanzassistent für bessere Geldverwaltung</p>
      </div>
      
            <div className="features">
              <div className="feature">
                <i className="fas fa-chart-bar"></i>
                <h3>Finanzübersicht</h3>
                <p>Behalten Sie Ihre Einnahmen und Ausgaben im Blick</p>
              </div>
              <div className="feature">
                <i className="fas fa-lightbulb"></i>
                <h3>Intelligente Tipps</h3>
                <p>MoneyBot gibt Ihnen personalisierte Empfehlungen</p>
              </div>
              <div className="feature">
                <i className="fas fa-target"></i>
                <h3>Sparziele</h3>
                <p>Setzen und erreichen Sie Ihre finanziellen Ziele</p>
              </div>
              <div className="feature">
                <i className="fas fa-shield-alt"></i>
                <h3>Sicherheit</h3>
                <p>Ihre Daten sind sicher und verschlüsselt</p>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="onboarding-step">
            <h2>Persönliche Daten</h2>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={onboardingData.personalInfo.name}
                onChange={(e) => updateData('personalInfo', 'name', e.target.value)}
                placeholder="Ihr vollständiger Name"
              />
            </div>
            <div className="form-group">
              <label>Alter</label>
              <input
                type="number"
                value={onboardingData.personalInfo.age}
                onChange={(e) => updateData('personalInfo', 'age', parseInt(e.target.value))}
                placeholder="Ihr Alter"
              />
            </div>
            <div className="form-group">
              <label>Beruf</label>
              <input
                type="text"
                value={onboardingData.personalInfo.occupation}
                onChange={(e) => updateData('personalInfo', 'occupation', e.target.value)}
                placeholder="Ihr Beruf"
              />
            </div>
            <div className="form-group">
              <label>Familienstand</label>
              <select
                value={onboardingData.personalInfo.familyStatus}
                onChange={(e) => updateData('personalInfo', 'familyStatus', e.target.value)}
              >
                <option value="single">Ledig</option>
                <option value="married">Verheiratet</option>
                <option value="divorced">Geschieden</option>
                <option value="widowed">Verwitwet</option>
              </select>
            </div>
            <div className="form-group">
              <label>Anzahl Kinder</label>
              <input
                type="number"
                value={onboardingData.personalInfo.children}
                onChange={(e) => updateData('personalInfo', 'children', parseInt(e.target.value))}
                placeholder="0"
              />
            </div>
    </div>
  );

      case 3:
        return (
          <div className="onboarding-step">
            <h2>Einkommen</h2>
            <div className="form-group">
              <label>Monatliches Nettoeinkommen</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.income.monthlyNetIncome}
                  onChange={(e) => updateData('income', 'monthlyNetIncome', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="moneybot-tip">
              <i className="fas fa-robot"></i>
              <p><strong>MoneyBot Tipp:</strong> Geben Sie Ihr monatliches Nettoeinkommen nach Abzug aller Steuern und Sozialabgaben an.</p>
            </div>
        </div>
        );

      case 4:
        return (
          <div className="onboarding-step">
            <h2>Wohnkosten</h2>
            <div className="form-group">
              <label>Miete/Kreditrate</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.housing.rent}
                  onChange={(e) => updateData('housing', 'rent', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Nebenkosten</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.housing.utilities}
                  onChange={(e) => updateData('housing', 'utilities', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Sonstige Wohnkosten</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.housing.otherHousing}
                  onChange={(e) => updateData('housing', 'otherHousing', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Hausratversicherung (jährlich)</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.housing.homeInsurance}
                  onChange={(e) => updateData('housing', 'homeInsurance', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="onboarding-step">
            <h2>Transport</h2>
            <div className="form-group">
              <label>Kraftstoff</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.transport.fuel}
                  onChange={(e) => updateData('transport', 'fuel', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Öffentliche Verkehrsmittel</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.transport.publicTransport}
                  onChange={(e) => updateData('transport', 'publicTransport', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Wartung & Reparaturen</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.transport.maintenance}
                  onChange={(e) => updateData('transport', 'maintenance', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>KFZ-Versicherung (jährlich)</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.transport.carInsurance}
                  onChange={(e) => updateData('transport', 'carInsurance', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>KFZ-Steuer (jährlich)</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.transport.carTax}
                  onChange={(e) => updateData('transport', 'carTax', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
      </div>
        );

      case 6:
        return (
          <div className="onboarding-step">
            <h2>Versicherungen</h2>
            <div className="form-group">
              <label>Krankenversicherung</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.insurance.healthInsurance}
                  onChange={(e) => updateData('insurance', 'healthInsurance', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Berufsunfähigkeitsversicherung</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.insurance.disabilityInsurance}
                  onChange={(e) => updateData('insurance', 'disabilityInsurance', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Rentenversicherung</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.insurance.pensionInsurance}
                  onChange={(e) => updateData('insurance', 'pensionInsurance', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Private Altersvorsorge</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.insurance.privatePension}
                  onChange={(e) => updateData('insurance', 'privatePension', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Haftpflichtversicherung (jährlich)</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.insurance.liabilityInsurance}
                  onChange={(e) => updateData('insurance', 'liabilityInsurance', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Sonstige Versicherungen</label>
              <div className="input-with-currency">
          <input
                  type="number"
                  value={onboardingData.insurance.otherInsurance}
                  onChange={(e) => updateData('insurance', 'otherInsurance', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
        </div>
        );

      case 7:
        return (
          <div className="onboarding-step">
            <h2>Digitale Services</h2>
            <div className="form-group">
              <label>Internet</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.digital.internet}
                  onChange={(e) => updateData('digital', 'internet', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Mobilfunk</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.digital.mobile}
                  onChange={(e) => updateData('digital', 'mobile', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Streaming (Netflix, Spotify, etc.)</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.digital.streaming}
                  onChange={(e) => updateData('digital', 'streaming', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Software & Apps</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.digital.software}
                  onChange={(e) => updateData('digital', 'software', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Cloud-Speicher</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.digital.cloud}
                  onChange={(e) => updateData('digital', 'cloud', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Gaming</label>
              <div className="input-with-currency">
          <input
            type="number"
                  value={onboardingData.digital.gaming}
                  onChange={(e) => updateData('digital', 'gaming', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
        </div>
        );

      case 8:
        return (
          <div className="onboarding-step">
            <h2>Gesundheit</h2>
            <div className="form-group">
              <label>Medikamente</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.health.medication}
                  onChange={(e) => updateData('health', 'medication', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Fitness & Sport</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.health.fitness}
                  onChange={(e) => updateData('health', 'fitness', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Wellness & Kosmetik</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.health.wellness}
                  onChange={(e) => updateData('health', 'wellness', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Alternative Medizin</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.health.alternativeMedicine}
                  onChange={(e) => updateData('health', 'alternativeMedicine', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Zahnarzt (jährlich)</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.health.dental}
                  onChange={(e) => updateData('health', 'dental', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Sonstige Gesundheitskosten</label>
              <div className="input-with-currency">
          <input
                  type="number"
                  value={onboardingData.health.otherHealth}
                  onChange={(e) => updateData('health', 'otherHealth', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
        </div>
      </div>
        );

      case 9:
        return (
          <div className="onboarding-step">
            <h2>Bildung & Unterhaltung</h2>
            <div className="form-group">
              <label>Bildung & Kurse</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.education.education}
                  onChange={(e) => updateData('education', 'education', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Bücher & Medien</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.education.books}
                  onChange={(e) => updateData('education', 'books', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Hobbys</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.education.hobbies}
                  onChange={(e) => updateData('education', 'hobbies', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Restaurant & Essen</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.education.restaurant}
                  onChange={(e) => updateData('education', 'restaurant', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Unterhaltung</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.education.entertainment}
                  onChange={(e) => updateData('education', 'entertainment', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
            </div>
            <div className="form-group">
              <label>Reisen (jährlich)</label>
              <div className="input-with-currency">
                <input
                  type="number"
                  value={onboardingData.education.travel}
                  onChange={(e) => updateData('education', 'travel', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
      </div>
    </div>
  );

      case 10:
        const totalExpenses = 
          (onboardingData.housing.rent || 0) +
          (onboardingData.housing.utilities || 0) +
          (onboardingData.housing.otherHousing || 0) +
          ((onboardingData.housing.homeInsurance || 0) / 12) +
          (onboardingData.transport.fuel || 0) +
          (onboardingData.transport.publicTransport || 0) +
          (onboardingData.transport.maintenance || 0) +
          ((onboardingData.transport.carInsurance || 0) / 12) +
          ((onboardingData.transport.carTax || 0) / 12) +
          (onboardingData.insurance.healthInsurance || 0) +
          (onboardingData.insurance.disabilityInsurance || 0) +
          (onboardingData.insurance.pensionInsurance || 0) +
          (onboardingData.insurance.privatePension || 0) +
          ((onboardingData.insurance.liabilityInsurance || 0) / 12) +
          (onboardingData.insurance.otherInsurance || 0) +
          (onboardingData.digital.internet || 0) +
          (onboardingData.digital.mobile || 0) +
          (onboardingData.digital.streaming || 0) +
          (onboardingData.digital.software || 0) +
          (onboardingData.digital.cloud || 0) +
          (onboardingData.digital.gaming || 0) +
          (onboardingData.health.medication || 0) +
          (onboardingData.health.fitness || 0) +
          (onboardingData.health.wellness || 0) +
          (onboardingData.health.alternativeMedicine || 0) +
          ((onboardingData.health.dental || 0) / 12) +
          (onboardingData.health.otherHealth || 0) +
          (onboardingData.education.education || 0) +
          (onboardingData.education.books || 0) +
          (onboardingData.education.hobbies || 0) +
          (onboardingData.education.restaurant || 0) +
          (onboardingData.education.entertainment || 0) +
          ((onboardingData.education.travel || 0) / 12);

        const availableBudget = (onboardingData.income.monthlyNetIncome || 0) - totalExpenses;
        const savingsRate = onboardingData.income.monthlyNetIncome > 0 ? 
          ((availableBudget / onboardingData.income.monthlyNetIncome) * 100).toFixed(1) : '0';

        return (
          <div className="onboarding-step">
            <h2>Finanzziele & Zusammenfassung</h2>
            
            <div className="form-group">
              <label>Hauptfinanzziel</label>
              <select
                value={onboardingData.goals.financialGoal}
                onChange={(e) => updateData('goals', 'financialGoal', e.target.value)}
              >
                <option value="">Bitte wählen</option>
                <option value="savings">Sparen</option>
                <option value="debt_reduction">Schuldenabbau</option>
                <option value="investment">Investitionen</option>
                <option value="emergency_fund">Notgroschen</option>
              </select>
      </div>

            <div className="form-group">
              <label>Monatliches Sparziel</label>
              <div className="input-with-currency">
          <input
            type="number"
                  value={onboardingData.goals.savingsGoal}
                  onChange={(e) => updateData('goals', 'savingsGoal', parseFloat(e.target.value))}
                  placeholder="0"
                />
                <span className="currency">€</span>
              </div>
        </div>
        
            <div className="form-group">
              <label>Zeitrahmen</label>
              <select
                value={onboardingData.goals.timeframe}
                onChange={(e) => updateData('goals', 'timeframe', e.target.value)}
              >
                <option value="">Bitte wählen</option>
                <option value="short_term">Kurzfristig (&lt; 1 Jahr)</option>
                <option value="medium_term">Mittelfristig (1-5 Jahre)</option>
                <option value="long_term">Langfristig (&gt; 5 Jahre)</option>
              </select>
            </div>

            <div className="summary-section">
              <h3>Ihre Finanzübersicht</h3>
              <div className="summary-grid">
                <div className="summary-card">
                  <div className="summary-label">Monatliches Einkommen</div>
                  <div className="summary-value income">
                    {onboardingData.income.monthlyNetIncome.toLocaleString('de-DE')}€
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Monatliche Ausgaben</div>
                  <div className="summary-value expenses">
                    {totalExpenses.toLocaleString('de-DE')}€
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Verfügbares Budget</div>
                  <div className={`summary-value ${availableBudget >= 0 ? 'positive' : 'negative'}`}>
                    {availableBudget.toLocaleString('de-DE')}€
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">Sparquote</div>
                  <div className="summary-value savings">
                    {savingsRate}%
                  </div>
          </div>
        </div>
      </div>

            <div className="completion-message">
              <i className="fas fa-check-circle"></i>
              <h3>Onboarding abgeschlossen!</h3>
              <p>Alle Ihre Daten wurden gespeichert und sind nun in Ihrem MoneyUP Dashboard verfügbar.</p>
      </div>
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <img src="/MoneyUP.png" alt="MoneyUP" className="logo" />
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Schritt {currentStep} von {totalSteps}
          </div>
        </div>
        </div>

      <div className="onboarding-content">
        {renderStep()}
      </div>
      
      <div className="onboarding-footer">
        <button 
          className="btn-secondary" 
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          Zurück
        </button>
        <button 
          className="btn-primary" 
          onClick={handleNext}
        >
          {currentStep === totalSteps ? 'Abschließen' : 'Weiter'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
