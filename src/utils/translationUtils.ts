import i18next from 'i18next';

// Define all possible translation keys
const translations = {
  common: {
    welcome: 'common.welcome',
    home: 'common.home',
    about: 'common.about',
    contact: 'common.contact',
    login: 'common.login',
    logout: 'common.logout',
    register: 'common.register',
    language: 'common.language',
    loading: 'common.loading',
    error: 'common.error',
    success: 'common.success',
    save: 'common.save',
    cancel: 'common.cancel',
    edit: 'common.edit',
    delete: 'common.delete',
    submit: 'common.submit',
    back: 'common.back',
    next: 'common.next',
    search: 'common.search',
    noResults: 'common.noResults',
    required: 'common.required',
    allRightsReserved: 'common.allRightsReserved'
  },
  temple: {
    name: 'temple.name',
    description: 'temple.description',
    address: 'temple.address',
    phone: 'temple.phone',
    email: 'temple.email',
    timings: 'temple.timings',
    events: 'temple.events',
    donations: 'temple.donations',
    gallery: 'temple.gallery',
    deities: 'temple.deities',
    religious: 'temple.religious',
    cultural: 'temple.cultural',
    calendar: 'temple.calendar',
    forms: 'temple.forms',
    services: 'temple.services',
    onlineServices: 'temple.onlineServices',
    pujaSchedule: 'temple.pujaSchedule',
    pujaServices: 'temple.pujaServices',
    prayerBooks: 'temple.prayerBooks',
    festivals: 'temple.festivals',
    priests: 'temple.priests',
    media: 'temple.media',
    currentEvents: 'temple.currentEvents',
    newsletter: 'temple.newsletter',
    annualCalendar: 'temple.annualCalendar',
    pujaSponsorships: 'temple.pujaSponsorships',
    facilityRequest: 'temple.facilityRequest',
    donationStatement: 'temple.donationStatement',
    addressChange: 'temple.addressChange',
    emailSubscription: 'temple.emailSubscription',
    allForms: 'temple.allForms',
    location: 'temple.location',
    volunteer: 'temple.volunteer',
    virtualVisit: 'temple.virtualVisit',
    feedback: 'temple.feedback',
    faq: 'temple.faq'
  },
  api: {
    error: {
      general: 'api.error.general',
      network: 'api.error.network',
      unauthorized: 'api.error.unauthorized',
      forbidden: 'api.error.forbidden',
      notFound: 'api.error.notFound',
      serverError: 'api.error.serverError',
      validation: 'api.error.validation'
    },
    success: {
      created: 'api.success.created',
      updated: 'api.success.updated',
      deleted: 'api.success.deleted',
      saved: 'api.success.saved'
    }
  }
} as const;

type TranslationKey = typeof translations[keyof typeof translations][keyof typeof translations[keyof typeof translations]];

// Translation function with type safety
export const t = (key: string): string => {
  return (i18next as any).t(key);
};

// Function to translate text using Google Translate API
const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.REACT_APP_GOOGLE_TRANSLATE_API_KEY}`
      },
      body: JSON.stringify({
        q: text,
        target: targetLang
      })
    });

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

// Function to translate API response data for display
export const translateApiData = async (data: any): Promise<any> => {
  if (!data) return data;

  const currentLang = i18next.language;
  if (currentLang === 'en') return data;

  try {
    if (typeof data === 'string') {
      return await translateText(data, currentLang);
    }

    if (Array.isArray(data)) {
      return Promise.all(data.map(item => translateApiData(item)));
    }

    if (typeof data === 'object') {
      const translatedData: any = {};
      for (const [key, value] of Object.entries(data)) {
        // Skip translation for certain fields
        if (['id', 'createdAt', 'updatedAt', 'email', 'phone', 'password'].includes(key)) {
          translatedData[key] = value;
        } else {
          translatedData[key] = await translateApiData(value);
        }
      }
      return translatedData;
    }

    return data;
  } catch (error) {
    console.error('API data translation error:', error);
    return data;
  }
};

// API response translation function
export const translateApiResponse = async (response: any): Promise<string> => {
  if (!response) return t('api.error.general');

  if (response.error) {
    return t('api.error.general');
  }

  if (response.success) {
    return t('api.success.saved');
  }

  return t('api.error.general');
};

// Format API error message
export const formatApiError = async (error: any): Promise<string> => {
  if (!error) return t('api.error.general');

  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 401: return t('api.error.unauthorized');
      case 403: return t('api.error.forbidden');
      case 404: return t('api.error.notFound');
      case 500: return t('api.error.serverError');
      default: return t('api.error.general');
    }
  }

  return t('api.error.general');
};

// Format API success message
export const formatApiSuccess = async (response: any): Promise<string> => {
  if (!response) return t('api.success.saved');
  return t('api.success.saved');
};

export default {
  t,
  translateApiData,
  translateApiResponse,
  formatApiError,
  formatApiSuccess,
  translations
}; 