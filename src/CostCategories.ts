// MoneyUP - Comprehensive Cost Categories
// Professional financial management categories with 50+ detailed options

export interface CostCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: CostSubcategory[];
  averageMonthly: number; // Average monthly cost in EUR
  priority: 'essential' | 'important' | 'optional';
  taxDeductible: boolean;
}

export interface CostSubcategory {
  id: string;
  name: string;
  description: string;
  averageMonthly: number;
  isRecurring: boolean;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  taxDeductible: boolean;
  tips: string[];
}

export const COST_CATEGORIES: CostCategory[] = [
  {
    id: 'housing',
    name: 'Wohnen & Immobilien',
    description: 'Alle Kosten rund um Ihre Wohnsituation',
    icon: 'fas fa-home',
    averageMonthly: 1200,
    priority: 'essential',
    taxDeductible: false,
    subcategories: [
      {
        id: 'rent',
        name: 'Miete (Kalt)',
        description: 'Grundmiete ohne Nebenkosten',
        averageMonthly: 800,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Mietspiegel regelmäßig prüfen',
          'Bei Mieterhöhungen Rechtmäßigkeit prüfen lassen',
          'Mietkaution separat anlegen'
        ]
      },
      {
        id: 'utilities',
        name: 'Nebenkosten',
        description: 'Heizung, Wasser, Müll, Hausmeister',
        averageMonthly: 250,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Nebenkostenabrechnung jährlich prüfen',
          'Energiesparen reduziert Heizkosten',
          'Widerspruchsfrist bei Nachzahlungen beachten'
        ]
      },
      {
        id: 'electricity',
        name: 'Strom',
        description: 'Stromverbrauch und Grundgebühr',
        averageMonthly: 80,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Stromanbieter jährlich vergleichen',
          'Ökostrom oft günstiger als Grundversorger',
          'Energieeffiziente Geräte sparen langfristig'
        ]
      },
      {
        id: 'home_insurance',
        name: 'Hausratversicherung',
        description: 'Versicherung für Hausrat und Einrichtung',
        averageMonthly: 25,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Versicherungssumme regelmäßig anpassen',
          'Grober Fahrlässigkeit-Klausel beachten',
          'Fahrrad-Diebstahl oft extra versichern'
        ]
      },
      {
        id: 'maintenance',
        name: 'Reparaturen & Instandhaltung',
        description: 'Kleinreparaturen und Renovierungen',
        averageMonthly: 45,
        isRecurring: false,
        frequency: 'one-time',
        taxDeductible: false,
        tips: [
          'Handwerkerkosten teilweise steuerlich absetzbar',
          'Kostenvoranschläge immer einholen',
          'Gewährleistung bei Reparaturen beachten'
        ]
      }
    ]
  },
  {
    id: 'mobility',
    name: 'Mobilität & Transport',
    description: 'Alle Fortbewegungskosten',
    icon: '🚗',
    averageMonthly: 400,
    priority: 'important',
    taxDeductible: true,
    subcategories: [
      {
        id: 'car_payment',
        name: 'Auto-Finanzierung/Leasing',
        description: 'Monatliche Rate für Fahrzeugfinanzierung',
        averageMonthly: 300,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Sondertilgungen bei Finanzierung prüfen',
          'Leasing vs. Kauf durchrechnen',
          'Restwert bei Leasing realistisch einschätzen'
        ]
      },
      {
        id: 'fuel',
        name: 'Kraftstoff',
        description: 'Benzin, Diesel oder Ladestrom',
        averageMonthly: 120,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Tankstellen-Apps für günstige Preise nutzen',
          'Fahrgemeinschaften bilden',
          'Fahrstil optimieren spart 10-15% Sprit'
        ]
      },
      {
        id: 'car_insurance',
        name: 'Kfz-Versicherung',
        description: 'Haftpflicht, Teilkasko, Vollkasko',
        averageMonthly: 80,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Jährlich Versicherungsvergleich durchführen',
          'Selbstbeteiligung erhöhen senkt Beiträge',
          'Schadenfreiheitsklasse schützen'
        ]
      },
      {
        id: 'public_transport',
        name: 'Öffentliche Verkehrsmittel',
        description: 'ÖPNV, Bahn, Bus-Abonnements',
        averageMonthly: 90,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Jahresabos oft günstiger als Monatstickets',
          'Arbeitgeber-Zuschüsse erfragen',
          'BahnCard bei häufigen Fernreisen'
        ]
      },
      {
        id: 'parking',
        name: 'Parken & Maut',
        description: 'Parkgebühren, Mautgebühren, Stellplatz',
        averageMonthly: 60,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Park-Apps für günstige Parkplätze',
          'Dauerparkplatz oft günstiger',
          'Mautgebühren bei Geschäftsreisen absetzbar'
        ]
      }
    ]
  },
  {
    id: 'health',
    name: 'Gesundheit & Vorsorge',
    description: 'Medizinische Versorgung und Vorsorge',
    icon: 'fas fa-heartbeat',
    averageMonthly: 350,
    priority: 'essential',
    taxDeductible: true,
    subcategories: [
      {
        id: 'health_insurance',
        name: 'Krankenversicherung',
        description: 'Gesetzliche oder private Krankenversicherung',
        averageMonthly: 280,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Zusatzversicherungen kritisch prüfen',
          'Selbstbeteiligung bei PKV beachten',
          'Bonusprogramme der Krankenkassen nutzen'
        ]
      },
      {
        id: 'supplementary_insurance',
        name: 'Zusatzversicherungen',
        description: 'Zahn, Brille, Heilpraktiker',
        averageMonthly: 45,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Leistungen genau prüfen vor Abschluss',
          'Wartezeiten bei Zahnzusatz beachten',
          'Altersrückstellungen bei PKV-Zusatz'
        ]
      },
      {
        id: 'medications',
        name: 'Medikamente & Hilfsmittel',
        description: 'Rezeptpflichtige und freiverkäufliche Medikamente',
        averageMonthly: 25,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Generika sind oft deutlich günstiger',
          'Zuzahlungsbefreiung bei hohen Kosten',
          'Online-Apotheken vergleichen'
        ]
      }
    ]
  },
  {
    id: 'digital',
    name: 'Digital & Technologie',
    description: 'Internet, Software und digitale Services',
    icon: 'fas fa-laptop',
    averageMonthly: 180,
    priority: 'important',
    taxDeductible: true,
    subcategories: [
      {
        id: 'internet',
        name: 'Internet & Festnetz',
        description: 'Breitband-Internet und Telefon',
        averageMonthly: 45,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Tarife regelmäßig vergleichen',
          'Kombi-Pakete oft günstiger',
          'Mindestlaufzeiten beachten'
        ]
      },
      {
        id: 'mobile',
        name: 'Mobilfunk',
        description: 'Handy-Vertrag oder Prepaid',
        averageMonthly: 35,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Datenverbrauch regelmäßig prüfen',
          'EU-Roaming ist kostenlos',
          'Discounter-Tarife oft ausreichend'
        ]
      },
      {
        id: 'software',
        name: 'Software & Apps',
        description: 'Office, Adobe, Streaming, Cloud-Services',
        averageMonthly: 65,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Jahresabos oft günstiger',
          'Kostenlose Alternativen prüfen',
          'Familientarife bei mehreren Nutzern'
        ]
      },
      {
        id: 'hardware',
        name: 'Hardware & Geräte',
        description: 'Computer, Smartphone, Tablets',
        averageMonthly: 35,
        isRecurring: false,
        frequency: 'yearly',
        taxDeductible: true,
        tips: [
          'Abschreibung über 3 Jahre möglich',
          'Refurbished-Geräte als Alternative',
          'Garantieverlängerungen meist überflüssig'
        ]
      }
    ]
  },
  {
    id: 'insurance',
    name: 'Versicherungen & Vorsorge',
    description: 'Absicherung und Altersvorsorge',
    icon: '🛡️',
    averageMonthly: 200,
    priority: 'essential',
    taxDeductible: true,
    subcategories: [
      {
        id: 'liability',
        name: 'Haftpflichtversicherung',
        description: 'Private Haftpflicht',
        averageMonthly: 8,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Deckungssumme mindestens 10 Mio. Euro',
          'Ausfalldeckung ist wichtig',
          'Singles und Familien unterscheiden'
        ]
      },
      {
        id: 'legal_protection',
        name: 'Rechtsschutzversicherung',
        description: 'Schutz bei Rechtsstreitigkeiten',
        averageMonthly: 25,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Wartezeiten bei Vertragsabschluss',
          'Nicht alle Bereiche sind versichert',
          'Anwaltswahl oft eingeschränkt'
        ]
      },
      {
        id: 'disability',
        name: 'Berufsunfähigkeitsversicherung',
        description: 'Absicherung bei Berufsunfähigkeit',
        averageMonthly: 80,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Früh abschließen für günstige Beiträge',
          'Verzicht auf abstrakte Verweisung wichtig',
          'Gesundheitsprüfung ehrlich beantworten'
        ]
      },
      {
        id: 'retirement',
        name: 'Private Altersvorsorge',
        description: 'Riester, Rürup, private Rente',
        averageMonthly: 87,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Staatliche Förderung optimal nutzen',
          'Kosten der Verträge beachten',
          'ETF-Sparpläne als Alternative prüfen'
        ]
      }
    ]
  },
  {
    id: 'finance',
    name: 'Banking & Finanzen',
    description: 'Konten, Karten und Finanzdienstleistungen',
    icon: 'fas fa-university',
    averageMonthly: 45,
    priority: 'important',
    taxDeductible: false,
    subcategories: [
      {
        id: 'account_fees',
        name: 'Kontoführungsgebühren',
        description: 'Gebühren für Giro- und Sparkonten',
        averageMonthly: 12,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Kostenlose Konten vergleichen',
          'Gehaltseingang oft Bedingung',
          'Online-Banken meist günstiger'
        ]
      },
      {
        id: 'credit_cards',
        name: 'Kreditkarten',
        description: 'Jahresgebühren und Zusatzleistungen',
        averageMonthly: 15,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Kostenlose Kreditkarten verfügbar',
          'Auslandseinsatz-Gebühren beachten',
          'Zusatzversicherungen meist überflüssig'
        ]
      },
      {
        id: 'financial_advice',
        name: 'Finanzberatung',
        description: 'Beratung durch Finanzexperten',
        averageMonthly: 18,
        isRecurring: false,
        frequency: 'quarterly',
        taxDeductible: true,
        tips: [
          'Honorarberatung oft transparenter',
          'Provisionsbasierte Beratung kritisch prüfen',
          'Zweitmeinung bei großen Entscheidungen'
        ]
      }
    ]
  },
  {
    id: 'education',
    name: 'Bildung & Weiterbildung',
    description: 'Lernen und berufliche Entwicklung',
    icon: 'fas fa-graduation-cap',
    averageMonthly: 120,
    priority: 'important',
    taxDeductible: true,
    subcategories: [
      {
        id: 'courses',
        name: 'Kurse & Seminare',
        description: 'Berufliche und private Weiterbildung',
        averageMonthly: 65,
        isRecurring: false,
        frequency: 'quarterly',
        taxDeductible: true,
        tips: [
          'Arbeitgeber-Förderung erfragen',
          'Online-Kurse oft günstiger',
          'Bildungsurlaub nutzen'
        ]
      },
      {
        id: 'books_materials',
        name: 'Bücher & Lernmaterialien',
        description: 'Fachliteratur und Lernhilfen',
        averageMonthly: 25,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Gebrauchte Bücher kaufen',
          'Bibliothek als kostenlose Alternative',
          'E-Books oft günstiger'
        ]
      },
      {
        id: 'certifications',
        name: 'Zertifikate & Prüfungen',
        description: 'Berufsqualifikationen und Lizenzen',
        averageMonthly: 30,
        isRecurring: false,
        frequency: 'yearly',
        taxDeductible: true,
        tips: [
          'Prüfungsgebühren sind absetzbar',
          'Rezertifizierung rechtzeitig planen',
          'Arbeitgeber-Unterstützung anfragen'
        ]
      }
    ]
  },
  {
    id: 'leisure',
    name: 'Freizeit & Lifestyle',
    description: 'Hobbys, Sport und Unterhaltung',
    icon: 'fas fa-target',
    averageMonthly: 280,
    priority: 'optional',
    taxDeductible: false,
    subcategories: [
      {
        id: 'sports',
        name: 'Sport & Fitness',
        description: 'Fitnessstudio, Vereine, Equipment',
        averageMonthly: 55,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Probetraining vor Vertragsabschluss',
          'Kündigungsfristen beachten',
          'Outdoor-Sport als kostenlose Alternative'
        ]
      },
      {
        id: 'hobbies',
        name: 'Hobbys & Ausrüstung',
        description: 'Materialien und Ausrüstung für Hobbys',
        averageMonthly: 85,
        isRecurring: false,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Gebrauchte Ausrüstung oft ausreichend',
          'Tauschen statt kaufen',
          'Saisonale Angebote nutzen'
        ]
      },
      {
        id: 'entertainment',
        name: 'Kultur & Unterhaltung',
        description: 'Kino, Theater, Konzerte, Streaming',
        averageMonthly: 75,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: false,
        tips: [
          'Streaming-Abos regelmäßig prüfen',
          'Kulturpass für Ermäßigungen',
          'Matinee-Vorstellungen oft günstiger'
        ]
      },
      {
        id: 'travel',
        name: 'Reisen & Urlaub',
        description: 'Urlaubsreisen und Wochenendtrips',
        averageMonthly: 65,
        isRecurring: false,
        frequency: 'quarterly',
        taxDeductible: false,
        tips: [
          'Frühbucher-Rabatte nutzen',
          'Vergleichsportale verwenden',
          'Reiseversicherungen kritisch prüfen'
        ]
      }
    ]
  },
  {
    id: 'family',
    name: 'Familie & Kinder',
    description: 'Kosten für Familienleben und Kinderbetreuung',
    icon: '👨‍👩‍👧‍👦',
    averageMonthly: 450,
    priority: 'essential',
    taxDeductible: true,
    subcategories: [
      {
        id: 'childcare',
        name: 'Kinderbetreuung',
        description: 'Kita, Tagesmutter, Babysitter',
        averageMonthly: 280,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Betreuungskosten zu 2/3 absetzbar',
          'Rechnung und Überweisung erforderlich',
          'Geschwisterrabatte erfragen'
        ]
      },
      {
        id: 'school_costs',
        name: 'Schule & Bildung',
        description: 'Schulgebühren, Material, Ausflüge',
        averageMonthly: 120,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Schulbedarf zum Schuljahresbeginn kaufen',
          'Bildungspaket für einkommensschwache Familien',
          'Gebrauchte Schulbücher nutzen'
        ]
      },
      {
        id: 'child_allowance',
        name: 'Kinder-Zusatzversicherungen',
        description: 'Zusätzliche Absicherung für Kinder',
        averageMonthly: 50,
        isRecurring: true,
        frequency: 'monthly',
        taxDeductible: true,
        tips: [
          'Kinderunfallversicherung sinnvoll',
          'Ausbildungsversicherung kritisch prüfen',
          'Familienversicherung nutzen bis 25 Jahre'
        ]
      }
    ]
  }
];

// Utility functions for cost calculations
export const calculateAnnualCost = (monthlyCost: number): number => {
  return monthlyCost * 12;
};

export const calculateTaxSavings = (cost: number, taxRate: number = 0.3): number => {
  return cost * taxRate;
};

export const getCategoryById = (id: string): CostCategory | undefined => {
  return COST_CATEGORIES.find(category => category.id === id);
};

export const getSubcategoryById = (categoryId: string, subcategoryId: string): CostSubcategory | undefined => {
  const category = getCategoryById(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const getTotalEstimatedMonthlyCosts = (): number => {
  return COST_CATEGORIES.reduce((total, category) => total + category.averageMonthly, 0);
};

