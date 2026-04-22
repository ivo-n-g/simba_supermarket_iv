import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'rw' | 'fr';

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

const translations: Translations = {
  searchPlaceholder: {
    en: 'Search for products...',
    rw: 'Shaka ibicuruzwa...',
    fr: 'Rechercher des produits...',
  },
  login: {
    en: 'Login',
    rw: 'Injira',
    fr: 'Connexion',
  },
  hello: {
    en: 'Hello',
    rw: 'Muraho',
    fr: 'Bonjour',
  },
  categories: {
    en: 'Categories',
    rw: 'Ibyiciro',
    fr: 'Catégories',
  },
  allCategories: {
    en: 'All Categories',
    rw: 'Ibyiciro byose',
    fr: 'Toutes les catégories',
  },
  shoppingCart: {
    en: 'Shopping Cart',
    rw: 'Ikarita yanjye',
    fr: 'Panier',
  },
  cartEmpty: {
    en: 'Your cart is empty',
    rw: 'Ikarita yawe irimo ubusa',
    fr: 'Votre panier est vide',
  },
  continueShopping: {
    en: 'Continue shopping',
    rw: 'Komeza guhaha',
    fr: 'Continuer les achats',
  },
  checkout: {
    en: 'Checkout',
    rw: 'Ishyura',
    fr: 'Payer',
  },
  subtotal: {
    en: 'Subtotal',
    rw: 'Igiteranyo',
    fr: 'Sous-total',
  },
  orderSuccess: {
    en: 'Order Received!',
    rw: 'Inshyu yakiriwe!',
    fr: 'Commande reçue !',
  },
  thankYou: {
    en: 'Thank you for shopping with Simba Supermarket.',
    rw: 'Murakoze guhahira muri Simba Supermarket.',
    fr: 'Merci d\'avoir fait vos achats chez Simba Supermarket.',
  },
  signInWithGoogle: {
    en: 'Sign in with Google',
    rw: 'Injira na Google',
    fr: 'Se connecter avec Google',
  },
  emailAddress: {
    en: 'Email Address',
    rw: 'Imeyili',
    fr: 'Adresse e-mail',
  },
  password: {
    en: 'Password',
    rw: 'Ijambo ry-ibanga',
    fr: 'Mot de passe',
  },
  signIn: {
    en: 'Sign In',
    rw: 'Injira',
    fr: 'Se connecter',
  },
  signUp: {
    en: 'Sign Up',
    rw: 'Kwiyandikisha',
    fr: 'S\'inscrire',
  },
  createAccount: {
    en: 'Create Account',
    rw: 'Fungura konti',
    fr: 'Créer un compte',
  },
  alreadyHaveAccount: {
    en: 'Already have an account?',
    rw: 'Ufite konti umaze gufungura?',
    fr: 'Vous avez déjà un compte ?',
  },
  dontHaveAccount: {
    en: 'Don\'t have an account?',
    rw: 'Ntaritubona konti?',
    fr: 'Vous n\'avez pas de compte ?',
  },
  fullName: {
    en: 'Full Name',
    rw: 'Amazina yose',
    fr: 'Nom complet',
  },
  profile: {
    en: 'Profile',
    rw: 'Imyirondoro',
    fr: 'Profil',
  },
  wishlist: {
    en: 'Wishlist',
    rw: 'Ibyo nifuza',
    fr: 'Liste de souhaits',
  },
  myOrders: {
    en: 'My Orders',
    rw: 'Ibyo nahoze',
    fr: 'Mes commandes',
  },
  logout: {
    en: 'Logout',
    rw: 'Sohoka',
    fr: 'Déconnexion',
  },
  emptyWishlist: {
    en: 'Your wishlist is empty',
    rw: 'Nta bintu birimo nifuza',
    fr: 'Votre liste de souhaits est vide',
  },
  personalInfo: {
    en: 'Personal Information',
    rw: 'Imyirondoro bwite',
    fr: 'Informations personnelles',
  },
  dashboard: {
    en: 'Dashboard',
    rw: 'Imyirondoro yanjye',
    fr: 'Tableau de bord',
  },
  orContinueWith: {
    en: 'Or continue with',
    rw: 'Cyangwa ukomeze na',
    fr: 'Ou continuer avec',
  },
  logoutConfirm: {
    en: 'Are you sure you want to logout?',
    rw: 'Wizeye ko ushaka gusohoka?',
    fr: 'Êtes-vous sûr de vouloir vous déconnecter ?',
  },
  remove: {
    en: 'Remove',
    rw: 'Gukuramo',
    fr: 'Supprimer',
  },
  addToCart: {
    en: 'Add',
    rw: 'Ongeramo',
    fr: 'Ajouter',
  },
  'Alcoholic Drinks': {
    en: 'Alcoholic Drinks',
    rw: 'Ibinyobwa bisindisha',
    fr: 'Boissons alcoolisées',
  },
  'Baby Products': {
    en: 'Baby Products',
    rw: 'Ibigenerwa abana',
    fr: 'Produits pour bébés',
  },
  'Cleaning & Sanitary': {
    en: 'Cleaning & Sanitary',
    rw: 'Isuku n-isukura',
    fr: 'Nettoyage et hygiène',
  },
  'Cosmetics & Personal Care': {
    en: 'Cosmetics & Personal Care',
    rw: 'Ibirungo n-ubwiza',
    fr: 'Cosmétiques et soins personnels',
  },
  'Food Products': {
    en: 'Food Products',
    rw: 'Ibiribwa',
    fr: 'Produits alimentaires',
  },
  'General': {
    en: 'General',
    rw: 'Rusange',
    fr: 'Général',
  },
  'Kitchen Storage': {
    en: 'Kitchen Storage',
    rw: 'Ibikoresho by-o mu gikoni',
    fr: 'Rangement de cuisine',
  },
  'Kitchenware & Electronics': {
    en: 'Kitchenware & Electronics',
    rw: 'Ibikoresho by-o mu nzu n-iby-ikoranabuhanga',
    fr: 'Ustensiles de cuisine et électronique',
  },
  'Pet Care': {
    en: 'Pet Care',
    rw: 'Iby-amatungo',
    fr: 'Soins pour animaux',
  },
  'Sports & Wellness': {
    en: 'Sports & Wellness',
    rw: 'Imikino n-ubuzima',
    fr: 'Sports et bien-être',
  },
  deliveryMethod: {
    en: 'Delivery Method',
    rw: 'Uburyo bwo kugezwaho ibintu',
    fr: 'Mode de livraison',
  },
  pickup: {
    en: 'Pick-up',
    rw: 'Kwifata',
    fr: 'Retrait',
  },
  delivery: {
    en: 'Delivery',
    rw: 'Kugezwaho',
    fr: 'Livraison',
  },
  pickupNote: {
    en: 'Pick up your order at our Kigali store.',
    rw: 'Fata ibyo waguze mu iduka ryacu riri i Kigali.',
    fr: 'Retirez votre commande dans notre magasin de Kigali.',
  },
  deliveryNote: {
    en: 'Home delivery within Kigali (Extra 2,000 RWF).',
    rw: 'Kugezwaho iwawe muri Kigali (Hiyongeraho 2,000 RWF).',
    fr: 'Livraison à domicile à Kigali (Supplément 2 000 RWF).',
  },
  searchResults: {
    en: 'Search results for',
    rw: 'Ibyabonetse kuri',
    fr: 'Résultats de recherche pour',
  },
  allProducts: {
    en: 'All Products',
    rw: 'Ibicuruzwa byose',
    fr: 'Tous les produits',
  },
  noProductsFound: {
    en: 'No products found',
    rw: 'Nta bicuruzwa byabonetse',
    fr: 'Aucun produit trouvé',
  },
  in: {
    en: 'in',
    rw: 'muri',
    fr: 'dans',
  },
  identityVerification: {
    en: 'Identity Verification',
    rw: 'Genzura imyirondoro',
    fr: 'Vérification d\'identité',
  },
  paymentVerification: {
    en: 'Payment Verification',
    rw: 'Genzura ubwishyu',
    fr: 'Vérification du paiement',
  },
  confirmDetails: {
    en: 'Confirm your details',
    rw: 'Emeza imyirondoro yawe',
    fr: 'Confirmez vos coordonnées',
  },
  paymentMethod: {
    en: 'Payment Method',
    rw: 'Uburyo bwo kwishyura',
    fr: 'Mode de paiement',
  },
  momo: {
    en: 'Mobile Money',
    rw: 'Momo',
    fr: 'Paiement mobile',
  },
  card: {
    en: 'Credit/Debit Card',
    rw: 'Ikarita ya Banki',
    fr: 'Carte de crédit/débit',
  },
  cash: {
    en: 'Cash on Delivery',
    rw: 'Kwishyura uhawe ibintu',
    fr: 'Paiement à la livraison',
  },
  processing: {
    en: 'Processing...',
    rw: 'Iratunganywa...',
    fr: 'Traitement...',
  },
  verifyIdentity: {
    en: 'Verify Identity',
    rw: 'Emeza ko ari wowe',
    fr: 'Vérifier l\'identité',
  },
  completePayment: {
    en: 'Complete Payment',
    rw: 'Rangiza kwishyura',
    fr: 'Finaliser le paiement',
  },
  step: {
    en: 'Step',
    rw: 'Intambwe',
    fr: 'Étape',
  },
  comingSoon: {
    en: 'Coming Soon',
    rw: 'Vuba aha',
    fr: 'Bientôt disponible',
  },
  recentSearches: {
    en: 'Recent Searches',
    rw: 'Ibyo washatse vuba',
    fr: 'Recherches récentes',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
