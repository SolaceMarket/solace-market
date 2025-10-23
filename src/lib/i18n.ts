import type { Locale } from "@/types/onboarding";

// English translations
export const enTranslations = {
  // Common
  common: {
    next: "Next",
    previous: "Previous",
    continue: "Continue",
    skip: "Skip",
    cancel: "Cancel",
    save: "Save",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    required: "Required",
    optional: "Optional",
    email: "Email",
    retry: "Retry",
    close: "Close",
  },

  // Stepper
  stepper: {
    welcome: "Welcome",
    consents: "Legal Consents",
    profile: "Profile",
    kyc: "Identity Verification",
    wallet: "Wallet Setup",
    broker: "Brokerage Account",
    security: "Security Setup",
    preferences: "Preferences",
    tour: "Product Tour",
    complete: "Complete",
  },

  // Welcome Step
  welcome: {
    title: "Welcome to Solace.Market",
    subtitle: "Your account has been created successfully",
    description:
      "Let's get you set up to trade tokenized assets with real collateral.",
    valueProps: {
      title: "What makes Solace.Market special:",
      props: [
        "Trade tokenized real-world assets",
        "Backed by real collateral and regulated custody",
        "Non-custodial Solana wallet integration",
        "Professional-grade brokerage services",
        "Transparent pricing and low fees",
      ],
    },
    startButton: "Get Started",
  },

  // Consents Step
  consents: {
    title: "Legal Agreements",
    subtitle: "Please review and accept our legal agreements to continue",
    description: "These agreements are required to use Solace.Market services.",
    agreements: {
      tos: {
        title: "Terms of Service",
        description: "Our terms and conditions for using the platform",
      },
      privacy: {
        title: "Privacy Policy",
        description: "How we collect, use, and protect your data",
      },
      risk: {
        title: "Risk Disclosure",
        description: "Important information about trading risks",
      },
    },
    checkbox: "I agree to the Terms, Privacy Policy, and Risk Disclosure.",
    acceptAll: "Accept All Agreements",
    viewDocument: "View Document",
  },

  // Profile Step
  profile: {
    title: "Personal Information",
    subtitle: "Tell us a bit about yourself",
    description:
      "This information is required for compliance and account verification.",
    fields: {
      firstName: "First Name",
      lastName: "Last Name",
      dob: "Date of Birth",
      country: "Country of Residence",
      taxResidency: "Tax Residency",
      address: "Address",
      phone: "Phone Number",
      experience: "Trading Experience",
    },
    experience: {
      beginner: "Beginner - New to trading",
      intermediate: "Intermediate - Some trading experience",
      advanced: "Advanced - Experienced trader",
    },
    jurisdictionNote:
      "Your jurisdiction will be automatically determined based on your country of residence.",
  },

  // KYC Step
  kyc: {
    title: "Identity Verification",
    subtitle: "Verify your identity to unlock trading features",
    description:
      "We use industry-standard KYC verification to ensure platform security.",
    provider: "Verification provided by MockKYC",
    upload: {
      title: "Upload Identity Documents",
      description: "Please provide a clear photo of your government-issued ID",
      idType: "ID Type",
      frontImage: "Front of ID",
      backImage: "Back of ID (if applicable)",
      liveness: "Live Selfie Verification",
    },
    status: {
      pending: "Verification in progress...",
      requires_more: "Additional documentation required",
      approved: "Identity verified successfully!",
      rejected: "Verification failed",
    },
    rejectedNote:
      "Please contact support for assistance with identity verification.",
    contactSupport: "Contact Support",
  },

  // Wallet Step
  wallet: {
    title: "Solana Wallet Setup",
    subtitle: "Connect your wallet or create a new one",
    description: "Connect your Solana wallet or create a new one.",
    options: {
      connect: {
        title: "Connect Existing Wallet",
        description: "Use Phantom, Solflare, or another Solana wallet",
        button: "Connect Wallet",
      },
      generate: {
        title: "Generate New Wallet",
        description: "We'll create a secure wallet for you",
        button: "Create Wallet",
        warning:
          "Important: Save your seed phrase in a secure location. You'll need it to recover your wallet.",
      },
    },
    verifySignature: "Please sign the message to verify wallet ownership",
    walletConnected: "Wallet connected successfully!",
    publicKey: "Public Key",
  },

  // Broker Step
  broker: {
    title: "Brokerage Account",
    subtitle: "Set up your brokerage sub-account",
    description:
      "Create a brokerage sub-account to access traditional financial markets.",
    omnibusModel: {
      title: "Omnibus Account Model",
      description:
        "Your assets are held in a segregated sub-account within our omnibus structure, providing both custody protection and efficient operations.",
      benefits: [
        "Segregated asset protection",
        "Regulatory compliance",
        "Efficient order execution",
        "Professional custody standards",
      ],
    },
    consents: {
      dataSharing:
        "I consent to sharing necessary data with our brokerage partner for account creation and compliance",
      omnibus: "I understand and consent to the omnibus account structure",
    },
    createAccount: "Create Brokerage Account",
    status: {
      active: "Brokerage account is active and ready to use",
      pending_review: "Account created - under review (funding may be delayed)",
      error: "Account creation failed",
    },
  },

  // Security Step
  security: {
    title: "Security Setup",
    subtitle: "Secure your account with two-factor authentication",
    description: "Add an extra layer of security to protect your account.",
    methods: {
      webauthn: {
        title: "Passkeys (Recommended)",
        description:
          "Use your device's built-in security (Face ID, Touch ID, Windows Hello)",
        setup: "Set up Passkey",
      },
      totp: {
        title: "Authenticator App",
        description: "Use Google Authenticator, Authy, or similar apps",
        setup: "Set up Authenticator",
      },
    },
    skipWarning: "Skipping 2FA makes your account less secure. Are you sure?",
    skipConfirm: "Skip 2FA Setup",
    setupLater: "Set up later",
    backupCodes: "Backup Codes",
    backupCodesDescription:
      "Save these backup codes in a secure location. You can use them to access your account if you lose your 2FA device.",
  },

  // Preferences Step
  preferences: {
    title: "Preferences",
    subtitle: "Customize your experience",
    description: "Set your notification and trading preferences.",
    notifications: {
      title: "Email Notifications",
      news: "Product news and updates",
      orderFills: "Order fills and trade confirmations",
      riskAlerts: "Risk alerts and margin calls",
      statements: "Monthly statements ready",
    },
    trading: {
      title: "Trading Preferences",
      defaultQuote: "Default quote currency",
      theme: "Interface theme",
      hintsEnabled: "Show helpful hints and tips",
    },
    themes: {
      dark: "Dark",
      light: "Light",
    },
  },

  // Tour Step
  tour: {
    title: "Quick Tour",
    subtitle: "Learn the basics in 2 minutes",
    description:
      "Optional tour of key features - you can skip this and explore on your own.",
    skip: "Skip Tour",
    start: "Start Tour",
    slides: {
      funding: {
        title: "Funding Your Account",
        description:
          "Transfer funds via bank transfer, wire, or supported cryptocurrencies.",
      },
      orders: {
        title: "Placing Orders",
        description:
          "Buy and sell tokenized assets with market, limit, and stop orders.",
      },
      collateral: {
        title: "Collateral & Risk",
        description:
          "Understand margin requirements and risk management tools.",
      },
      support: {
        title: "Support & Resources",
        description: "Access help docs, live chat, and educational materials.",
      },
    },
    finish: "Finish Tour",
  },

  // Complete Step
  complete: {
    title: "Welcome to Solace.Market!",
    subtitle: "Your account setup is complete",
    description: "You're all set to start trading tokenized assets.",
    nextSteps: {
      title: "Next Steps",
      steps: [
        "Fund your account to start trading",
        "Explore our asset marketplace",
        "Set up price alerts for your favorite assets",
        "Join our community for market insights",
      ],
    },
    goToDashboard: "Go to Dashboard",
    pendingItems: {
      title: "Pending Items",
      kyc: "Identity verification still in progress",
      broker: "Brokerage account under review",
    },
  },

  // Error Messages
  errors: {
    generic: "An unexpected error occurred. Please try again.",
    network: "Network error. Please check your connection.",
    validation: "Please fix the validation errors below.",
    unauthorized: "You must be logged in to continue.",
    forbidden: "You don't have permission to perform this action.",
    notFound: "The requested resource was not found.",
    kycRequired: "Identity verification is required for trading.",
    walletRequired: "Wallet connection is required.",
    brokerRequired: "Brokerage account is required for trading.",
    stepNotCompleted: "Please complete the previous step first.",
  },
} as const;

// German translations
export const deTranslations = {
  // Common
  common: {
    next: "Weiter",
    previous: "Zurück",
    continue: "Fortfahren",
    skip: "Überspringen",
    cancel: "Abbrechen",
    save: "Speichern",
    loading: "Lädt...",
    error: "Fehler",
    success: "Erfolgreich",
    required: "Erforderlich",
    optional: "Optional",
    email: "E-Mail",
    retry: "Wiederholen",
    close: "Schließen",
  },

  // Stepper
  stepper: {
    welcome: "Willkommen",
    consents: "Rechtliches",
    profile: "Profil",
    kyc: "Identitätsprüfung",
    // wallet: "Wallet-Setup",
    // broker: "Brokerage-Konto",
    // security: "Sicherheit",
    // preferences: "Einstellungen",
    // tour: "Produkttour",
    done: "Abgeschlossen",
  },

  // Welcome Step
  welcome: {
    title: "Willkommen bei Solace.Market",
    subtitle: "Ihr Konto wurde erfolgreich erstellt",
    description:
      "Lass uns dich für den Handel mit tokenisierten Assets einrichten – mit echter Besicherung.",
    valueProps: {
      title: "Was Solace.Market besonders macht:",
      props: [
        "Handel mit tokenisierten Real-World-Assets",
        "Besichert durch echte Sicherheiten und regulierte Verwahrung",
        "Non-custodial Solana-Wallet-Integration",
        "Professionelle Brokerage-Services",
        "Transparente Preisgestaltung und niedrige Gebühren",
      ],
    },
    startButton: "Loslegen",
  },

  // Consents Step
  consents: {
    title: "Rechtliche Vereinbarungen",
    subtitle:
      "Bitte prüfen und akzeptieren Sie unsere rechtlichen Vereinbarungen",
    description:
      "Diese Vereinbarungen sind für die Nutzung von Solace.Market erforderlich.",
    agreements: {
      tos: {
        title: "Allgemeine Geschäftsbedingungen",
        description: "Unsere Geschäftsbedingungen für die Plattformnutzung",
      },
      privacy: {
        title: "Datenschutzerklärung",
        description: "Wie wir Ihre Daten sammeln, verwenden und schützen",
      },
      risk: {
        title: "Risikohinweis",
        description: "Wichtige Informationen über Handelsrisiken",
      },
    },
    checkbox:
      "Ich stimme den AGB, der Datenschutzerklärung und dem Risiko-Hinweis zu.",
    acceptAll: "Alle Vereinbarungen akzeptieren",
    viewDocument: "Dokument anzeigen",
  },

  // Profile Step
  profile: {
    title: "Persönliche Angaben",
    subtitle: "Erzählen Sie uns etwas über sich",
    description:
      "Diese Informationen sind für Compliance und Kontoverifizierung erforderlich.",
    fields: {
      firstName: "Vorname",
      lastName: "Nachname",
      dob: "Geburtsdatum",
      country: "Wohnsitzland",
      taxResidency: "Steuerlicher Wohnsitz",
      address: "Adresse",
      phone: "Telefonnummer",
      experience: "Handelserfahrung",
    },
    experience: {
      beginner: "Anfänger - Neu im Trading",
      intermediate: "Fortgeschritten - Etwas Handelserfahrung",
      advanced: "Experte - Erfahrener Trader",
    },
    jurisdictionNote:
      "Ihre Jurisdiktion wird automatisch basierend auf Ihrem Wohnsitzland bestimmt.",
  },

  // KYC Step
  kyc: {
    title: "Identitätsprüfung",
    subtitle:
      "Verifizieren Sie Ihre Identität um Trading-Features freizuschalten",
    description:
      "Wir verwenden branchenübliche KYC-Verifizierung für Plattform-Sicherheit.",
    provider: "Verifizierung durch MockKYC",
    upload: {
      title: "Identitätsdokumente hochladen",
      description:
        "Bitte stellen Sie ein klares Foto Ihres amtlichen Ausweises zur Verfügung",
      idType: "Ausweistyp",
      frontImage: "Vorderseite des Ausweises",
      backImage: "Rückseite des Ausweises (falls zutreffend)",
      liveness: "Live-Selfie-Verifizierung",
    },
    status: {
      pending: "Verifizierung läuft...",
      requires_more: "Zusätzliche Dokumentation erforderlich",
      approved: "Identität erfolgreich verifiziert!",
      rejected: "Verifizierung fehlgeschlagen",
    },
    rejectedNote:
      "Bitte kontaktieren Sie den Support für Hilfe bei der Identitätsprüfung.",
    contactSupport: "Support kontaktieren",
  },

  // Wallet Step
  wallet: {
    title: "Solana-Wallet-Setup",
    subtitle: "Verbinden Sie Ihr Wallet oder erstellen Sie ein neues",
    description: "Verbinde deine Solana-Wallet oder erstelle eine neue.",
    options: {
      connect: {
        title: "Bestehendes Wallet verbinden",
        description:
          "Phantom, Solflare oder ein anderes Solana-Wallet verwenden",
        button: "Wallet verbinden",
      },
      generate: {
        title: "Neues Wallet generieren",
        description: "Wir erstellen ein sicheres Wallet für Sie",
        button: "Wallet erstellen",
        warning:
          "Wichtig: Speichern Sie Ihre Seed-Phrase an einem sicheren Ort. Sie benötigen sie zur Wiederherstellung Ihres Wallets.",
      },
    },
    verifySignature:
      "Bitte signieren Sie die Nachricht zur Wallet-Verifizierung",
    walletConnected: "Wallet erfolgreich verbunden!",
    publicKey: "Öffentlicher Schlüssel",
  },

  // Broker Step
  broker: {
    title: "Brokerage-Konto",
    subtitle: "Richten Sie Ihr Brokerage-Unterkonto ein",
    description:
      "Erstellen Sie ein Brokerage-Unterkonto für den Zugang zu traditionellen Finanzmärkten.",
    omnibusModel: {
      title: "Omnibus-Konto-Modell",
      description:
        "Ihre Assets werden in einem segregierten Unterkonto innerhalb unserer Omnibus-Struktur gehalten, was sowohl Verwahrungsschutz als auch effiziente Abläufe bietet.",
      benefits: [
        "Segregierter Asset-Schutz",
        "Regulatorische Compliance",
        "Effiziente Orderausführung",
        "Professionelle Verwahrungsstandards",
      ],
    },
    consents: {
      dataSharing:
        "Ich stimme der Weitergabe notwendiger Daten an unseren Brokerage-Partner für Kontoeröffnung und Compliance zu",
      omnibus: "Ich verstehe und stimme der Omnibus-Kontostruktur zu",
    },
    createAccount: "Brokerage-Konto erstellen",
    status: {
      active: "Brokerage-Konto ist aktiv und einsatzbereit",
      pending_review:
        "Konto erstellt - wird geprüft (Finanzierung könnte verzögert sein)",
      error: "Kontoerstellung fehlgeschlagen",
    },
  },

  // Security Step
  security: {
    title: "Sicherheits-Setup",
    subtitle: "Sichern Sie Ihr Konto mit Zwei-Faktor-Authentifizierung",
    description:
      "Fügen Sie eine zusätzliche Sicherheitsebene zum Schutz Ihres Kontos hinzu.",
    methods: {
      webauthn: {
        title: "Passkeys (Empfohlen)",
        description:
          "Verwenden Sie die integrierte Sicherheit Ihres Geräts (Face ID, Touch ID, Windows Hello)",
        setup: "Passkey einrichten",
      },
      totp: {
        title: "Authenticator-App",
        description: "Google Authenticator, Authy oder ähnliche Apps verwenden",
        setup: "Authenticator einrichten",
      },
    },
    skipWarning:
      "Das Überspringen der 2FA macht Ihr Konto weniger sicher. Sind Sie sicher?",
    skipConfirm: "2FA-Setup überspringen",
    setupLater: "Später einrichten",
    backupCodes: "Backup-Codes",
    backupCodesDescription:
      "Speichern Sie diese Backup-Codes an einem sicheren Ort. Sie können sie verwenden, um auf Ihr Konto zuzugreifen, wenn Sie Ihr 2FA-Gerät verlieren.",
  },

  // Preferences Step
  preferences: {
    title: "Einstellungen",
    subtitle: "Personalisieren Sie Ihre Erfahrung",
    description:
      "Stellen Sie Ihre Benachrichtigungs- und Trading-Präferenzen ein.",
    notifications: {
      title: "E-Mail-Benachrichtigungen",
      news: "Produktnews und Updates",
      orderFills: "Order-Ausführungen und Handelsbestätigungen",
      riskAlerts: "Risiko-Warnungen und Margin-Calls",
      statements: "Monatsabrechnungen verfügbar",
    },
    trading: {
      title: "Trading-Einstellungen",
      defaultQuote: "Standard-Quotierungswährung",
      theme: "Interface-Theme",
      hintsEnabled: "Hilfreiche Hinweise und Tipps anzeigen",
    },
    themes: {
      dark: "Dunkel",
      light: "Hell",
    },
  },

  // Tour Step
  tour: {
    title: "Schnelltour",
    subtitle: "Lernen Sie die Grundlagen in 2 Minuten",
    description:
      "Optionale Tour der wichtigsten Features - Sie können diese überspringen und selbst erkunden.",
    skip: "Tour überspringen",
    start: "Tour starten",
    slides: {
      funding: {
        title: "Ihr Konto finanzieren",
        description:
          "Überweisen Sie Geld per Banküberweisung, Wire oder unterstützten Kryptowährungen.",
      },
      orders: {
        title: "Orders platzieren",
        description:
          "Kaufen und verkaufen Sie tokenisierte Assets mit Market-, Limit- und Stop-Orders.",
      },
      collateral: {
        title: "Sicherheiten & Risiko",
        description:
          "Verstehen Sie Margin-Anforderungen und Risikomanagement-Tools.",
      },
      support: {
        title: "Support & Ressourcen",
        description:
          "Zugriff auf Hilfedokumente, Live-Chat und Bildungsmaterialien.",
      },
    },
    finish: "Tour beenden",
  },

  // Complete Step
  complete: {
    title: "Willkommen bei Solace.Market!",
    subtitle: "Ihr Konto-Setup ist abgeschlossen",
    description:
      "Sie sind bereit, mit dem Handel von tokenisierten Assets zu beginnen.",
    nextSteps: {
      title: "Nächste Schritte",
      steps: [
        "Finanzieren Sie Ihr Konto um mit dem Trading zu beginnen",
        "Erkunden Sie unseren Asset-Marktplatz",
        "Richten Sie Preisalarme für Ihre Lieblings-Assets ein",
        "Treten Sie unserer Community für Markteinblicke bei",
      ],
    },
    goToDashboard: "Zum Dashboard",
    pendingItems: {
      title: "Ausstehende Punkte",
      kyc: "Identitätsprüfung läuft noch",
      broker: "Brokerage-Konto wird geprüft",
    },
  },

  // Error Messages
  errors: {
    generic:
      "Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    network: "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung.",
    validation: "Bitte beheben Sie die Validierungsfehler unten.",
    unauthorized: "Sie müssen angemeldet sein um fortzufahren.",
    forbidden: "Sie haben keine Berechtigung für diese Aktion.",
    notFound: "Die angeforderte Ressource wurde nicht gefunden.",
    kycRequired: "Identitätsprüfung ist für Trading erforderlich.",
    walletRequired: "Wallet-Verbindung ist erforderlich.",
    brokerRequired: "Brokerage-Konto ist für Trading erforderlich.",
    stepNotCompleted: "Bitte schließen Sie zuerst den vorherigen Schritt ab.",
  },
} as const;

export type TranslationKey = keyof typeof enTranslations;

export const translations = {
  en: enTranslations,
  de: deTranslations,
};

// Translation function
export function t(locale: Locale, key: string): string | null {
  const keys = key.split(".");
  let value: unknown = translations[locale];

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to English if key not found in current locale
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          //   return `Missing translation: ${key}`;
          return null;
        }
      }
      break;
    }
  }

  return typeof value === "string" ? value : `Invalid translation key: ${key}`;
}

// Hook for getting translations in components
export function useTranslations(locale: Locale) {
  return (key: string) => t(locale, key);
}
