import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  added: {
    en: 'Added!',
    rw: 'Byongewe!',
    fr: 'Ajouté !',
  },
  demoOrderReceived: {
    en: 'Demo order received',
    rw: 'Komande yanyu yakiriwe',
    fr: 'Commande de démonstration reçue',
  },
  orderSuccess: {
    en: 'Order Received!',
    rw: 'Inshyu yakiriwe!',
    fr: 'Commande reçue !',
  },
  thankYou: {
    en: 'Thank you for shopping with Simba Supermarket.',
    rw: 'Murakoze guhahira muri Simba Isoko rigezweho.',
    fr: 'Merci d\'avoir fait vos achats chez Simba Supermarché.',
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
  slogan: {
    en: "Rwanda's Online Supermarket",
    rw: "Isoko ryawe rya mbere mu Rwanda",
    fr: "Votre supermarché en ligne au Rwanda",
  },
  supermarket: {
    en: 'Supermarket',
    rw: 'Isoko rigezweho',
    fr: 'Supermarché',
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
  addToWishlist: {
    en: 'Wishlist',
    rw: 'Nifuza',
    fr: 'Souhait',
  },
  premiumPromise: {
    en: 'Premium Promise',
    rw: 'Isezerano rya Simba',
    fr: 'Promesse Premium',
  },
  verified: {
    en: 'Verified',
    rw: 'Byemejwe',
    fr: 'Vérifié',
  },
  qualityTrust: {
    en: 'Quality You Can Trust.',
    rw: 'Ubwiza Wakwizera.',
    fr: 'Une qualité de confiance.',
  },
  guaranteeNote: {
    en: 'We guarantee the freshness of every item. If you\'re not satisfied, we\'ll replace it instantly at any of our branches across Kigali.',
    rw: 'Turizera ubwiza n-ubushya bw-ibyo tugurisha byose. Iyo utanyuzwe, duhita tubyagusimburira ku ishami ryacu iryo ari ryo ryose muri Kigali.',
    fr: 'Nous garantissons la fraîcheur de chaque article. Si vous n\'êtes pas satisfait, nous le remplacerons instantanément dans l\'une de nos succursales à Kigali.',
  },
  internal: {
    en: 'Internal',
    rw: 'Imbere mu kigo',
    fr: 'Interne',
  },
  marketRepPortal: {
    en: 'Market Rep Portal',
    rw: 'Igenzura ry\'umukozi',
    fr: 'Portail Représentant',
  },
  managementConsole: {
    en: 'Management Console',
    rw: 'Igenzura ry\'imikorere',
    fr: 'Console de gestion',
  },
  welcomeBack: {
    en: 'Welcome back',
    rw: 'Muraho neza',
    fr: 'Bon retour',
  },
  monitoringPipelines: {
    en: 'Monitoring active pipelines for',
    rw: 'Gucunga imikorere y-ishami rya',
    fr: 'Suivi des pipelines actifs pour',
  },
  successRate: {
    en: 'Success Rate',
    rw: 'Igipimo cy-imyitwarire',
    fr: 'Taux de réussite',
  },
  avgFulfillment: {
    en: 'Avg. Fulfillment',
    rw: 'Igihe bitwara',
    fr: 'Délai moyen',
  },
  awaitingPickup: {
    en: 'Awaiting Pickup',
    rw: 'Ibitegereje gufatwa',
    fr: 'En attente de retrait',
  },
  dispatchedUnits: {
    en: 'Dispatched Units',
    rw: 'Ibyatanzwe',
    fr: 'Unités expédiées',
  },
  revenueToday: {
    en: 'Revenue (Today)',
    rw: 'Amafaranga yishyuwe uyu munsi',
    fr: 'Revenu (aujourd\'hui)',
  },
  workflowQueue: {
    en: 'Workflow Queue',
    rw: 'Urutonde rwa komande',
    fr: 'File d\'attente',
  },
  viewArchive: {
    en: 'View Archive',
    rw: 'Reba ibyahise',
    fr: 'Voir l\'archive',
  },
  reference: {
    en: 'Reference',
    rw: 'Numero',
    fr: 'Référence',
  },
  clientIdentity: {
    en: 'Client Identity',
    rw: 'Umukiriya',
    fr: 'Identité client',
  },
  status: {
    en: 'Status',
    rw: 'Imiterere',
    fr: 'Statut',
  },
  operation: {
    en: 'Operation',
    rw: 'Igikorwa',
    fr: 'Opération',
  },
  queueEmpty: {
    en: 'Queue is currently empty',
    rw: 'Nta komande zihari ubu',
    fr: 'La file est vide',
  },
  performance: {
    en: 'Performance',
    rw: 'Imikorere',
    fr: 'Performance',
  },
  freshnessIndex: {
    en: 'Freshness Index',
    rw: 'Igipimo cy-ubushya',
    fr: 'Indice de fraîcheur',
  },
  logisticsFlow: {
    en: 'Logistics Flow',
    rw: 'Ingendo',
    fr: 'Flux logistique',
  },
  staffLoad: {
    en: 'Staff Load',
    rw: 'Ingano y-akazi ku bakozi',
    fr: 'Charge du personnel',
  },
  updateStock: {
    en: 'Update Stock',
    rw: 'Gura ibicuruzwa',
    fr: 'Mettre à jour le stock',
  },
  expandCatalog: {
    en: 'Expand catalog availability instantly.',
    rw: 'Ongeramo ibicuruzwa bishya mu kanya gato.',
    fr: 'Développez le catalogue instantanément.',
  },
  unitsInStock: {
    en: 'units in stock',
    rw: 'bihari mu bubiko',
    fr: 'unités en stock',
  },
  endSession: {
    en: 'End Session',
    rw: 'Soza akazi',
    fr: 'Fin de session',
  },
  activeNow: {
    en: 'Active Now',
    rw: 'Ari gukora ubu',
    fr: 'Actif maintenant',
  },
  shiftStatus: {
    en: 'Shift Status',
    rw: 'Imiterere y-akazi',
    fr: 'Statut de l\'équipe',
  },
  productTitle: {
    en: 'Product Title',
    rw: 'Izina ry-igicuruzwa',
    fr: 'Nom du produit',
  },
  unitType: {
    en: 'Unit Type',
    rw: 'Ubwo bwoko',
    fr: 'Type d\'unité',
  },
  uploadIdentity: {
    en: 'Upload Identity Media',
    rw: 'Shyiraho ifoto',
    fr: 'Télécharger une image',
  },
  syncCatalog: {
    en: 'Verify and Sync Catalog',
    rw: 'Emeza igicuruzwa',
    fr: 'Vérifier et synchroniser',
  },
  'All': {
    en: 'All Categories',
    rw: 'Ibyiciro Byose',
    fr: 'Toutes les catégories',
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
    fr: 'Soins personnels',
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
    rw: 'Ibikoresho byo mu gikoni',
    fr: 'Rangement de cuisine',
  },
  'Kitchenware & Electronics': {
    en: 'Kitchenware & Electronics',
    rw: 'Ibikoresho byo mu nzu',
    fr: 'Ustensiles de cuisine',
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
  selectBranch: {
    en: 'Select Pickup Branch',
    rw: 'Hitamo aho uzafatira ibintu',
    fr: 'Sélectionnez le point de retrait',
  },
  pleaseSelectBranch: {
    en: 'Please select a branch to continue.',
    rw: 'Hitamo ishami uzafatiraho ibintu.',
    fr: 'Veuillez sélectionner un point de retrait.',
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
  },
  exploreCategories: {
    en: 'Explore Categories',
    rw: 'Shaka mu byiciro',
    fr: 'Explorer les catégories',
  },
  ourLocations: {
    en: 'Our Locations',
    rw: 'Aho dukorera',
    fr: 'Nos emplacements',
  },
  findUs: {
    en: 'Find the nearest Simba Supermarket in Kigali',
    rw: 'Shaka iduka rya Simba rikuvubereye muri Kigali',
    fr: 'Trouvez le supermarché Simba le plus proche à Kigali',
  },
  getStarted: {
    en: 'Get Started',
    rw: 'Tangira ubu',
    fr: 'Commencer',
  },
  contactUs: {
    en: 'Contact Us',
    rw: 'Twandikire',
    fr: 'Contactez-nous',
  },
  sendMessage: {
    en: 'Send Message',
    rw: 'Yohereza ubutumwa',
    fr: 'Envoyer le message',
  },
  message: {
    en: 'Message',
    rw: 'Ubutumwa',
    fr: 'Message',
  },
  messageSent: {
    en: 'Message sent successfully!',
    rw: 'Ubutumwa bwoherejwe neza!',
    fr: 'Message envoyé avec succès !',
  },
  howCanWeHelp: {
    en: 'How can we help you?',
    rw: 'Ni gute twagufasha?',
    fr: 'Comment pouvons-nous vous aider ?',
  },
  priceRange: {
    en: 'Price Range',
    rw: 'Igiciro',
    fr: 'Gamme de prix',
  },
  onlyInStock: {
    en: 'Only In Stock',
    rw: 'Ibihari gusa',
    fr: 'En stock uniquement',
  },
  filters: {
    en: 'Filters',
    rw: 'Akayunguruzo',
    fr: 'Filtres',
  },
  pickupTime: {
    en: 'Pick-up Time',
    rw: 'Igihe cyo gufatira',
    fr: 'Heure de retrait',
  },
  momoDeposit: {
    en: 'Momo Deposit',
    rw: 'Ingwate ya Momo',
    fr: 'Dépôt Momo',
  },
  depositNote: {
    en: 'A non-refundable deposit of 500 RWF is required to confirm your pick-up order.',
    rw: 'Ingwate y-amafaranga 500 adasubizwa irakenewe kugira ngo wemeze ko uzafata ibyo waguze.',
    fr: 'Un dépôt non remboursable de 500 RWF est requis pour confirmer votre commande de retrait.',
  },
  branchDashboard: {
    en: 'Branch Dashboard',
    rw: 'Imicungire y-ishami',
    fr: 'Tableau de bord de la succursale',
  },
  manager: {
    en: 'Manager',
    rw: 'Umuyobozi',
    fr: 'Directeur',
  },
  staff: {
    en: 'Staff',
    rw: 'Umukozi',
    fr: 'Personnel',
  },
  assign: {
    en: 'Assign',
    rw: 'Ohereza',
    fr: 'Assigner',
  },
  markReady: {
    en: 'Mark Ready',
    rw: 'Emeza ko byabonetse',
    fr: 'Marquer comme prêt',
  },
  stock: {
    en: 'Stock',
    rw: 'Ibiherereye mu bubiko',
    fr: 'Stock',
  },
  reviews: {
    en: 'Reviews',
    rw: 'Ibitekerezo',
    fr: 'Avis',
  },
  rateExperience: {
    en: 'Rate your experience',
    rw: 'Vuga uko byagenze',
    fr: 'Évaluez votre expérience',
  },
  startShopping: {
    en: 'Start Shopping',
    rw: 'Tangira guhaha',
    fr: 'Commencer les achats',
  },
  freshProducts: {
    en: 'Fresh products',
    rw: 'Ibicuruzwa bishya',
    fr: 'Produits frais',
  },
  fastDelivery: {
    en: 'Fast delivery',
    rw: 'Kugezwaho vuba',
    fr: 'Livraison rapide',
  },
  momoPayment: {
    en: 'MoMo payment',
    rw: 'Kwishyura na MoMo',
    fr: 'Paiement MoMo',
  },
  forgotPassword: {
    en: 'Forgot Password?',
    rw: 'Wibagiwe ijambo ry-ibanga?',
    fr: 'Mot de passe oublié ?',
  },
  resetLinkSent: {
    en: 'Reset link sent to your email!',
    rw: 'Ihuza ryo guhindura ijambo ry-ibanga ryoherejwe kuri imeyili yawe!',
    fr: 'Lien de réinitialisation envoyé à votre e-mail !',
  },
  premiumProducts: {
    en: 'Premium Products',
    rw: 'Ibicuruzwa Byiza',
    fr: 'Produits de qualité',
  },
  kigaliBranches: {
    en: 'Kigali Branches',
    rw: 'Amashami ya Kigali',
    fr: 'Succursales de Kigali',
  },
  customerRating: {
    en: 'Customer Rating',
    rw: 'Uko abakiriya babona',
    fr: 'Avis des clients',
  },
  exploreCategoriesDesc: {
    en: 'Fresh quality products from Simba Supermarket, now closer to you than ever.',
    rw: 'Ibicuruzwa byiza bishya bya Simba, ubu biri hafi yawe kuruta mbere.',
    fr: 'Des produits frais de qualité de Simba Supermarché, maintenant plus près de vous.',
  },
  viewAllProducts: {
    en: 'View All Products',
    rw: 'Reba ibicuruzwa byose',
    fr: 'Voir tous les produits',
  },
  visitUs: {
    en: 'Visit Us',
    rw: 'Dusure',
    fr: 'Rendez-nous visite',
  },
  acrossKigali: {
    en: 'Across Kigali',
    rw: 'Muri Kigali hose',
    fr: 'À travers Kigali',
  },
  findNearest: {
    en: 'Find your nearest Simba branch for fresh products, premium quality, and the best shopping experience in Rwanda.',
    rw: 'Shaka ishami rya Simba rikwegereye ubone ibicuruzwa bishya byiza n-uburambe mu guhaha mu Rwanda.',
    fr: 'Trouvez votre succursale Simba la plus proche pour des produits frais et la meilleure expérience d\'achat au Rwanda.',
  },
  selectedBranch: {
    en: 'Selected Branch',
    rw: 'Ishami wahisemo',
    fr: 'Succursale sélectionnée',
  },
  nearest: {
    en: 'NEAREST',
    rw: 'Hafi',
    fr: 'PLUS PROCHE',
  },
  locatedClosest: {
    en: 'Located Closest to You',
    rw: 'Iherereye hafi yawe',
    fr: 'Situé au plus près de vous',
  },
  getDirections: {
    en: 'Get Directions',
    rw: 'Reba icyerekezo',
    fr: 'Obtenir l\'itinéraire',
  },
  freshEveryday: {
    en: 'Fresh Everyday',
    rw: 'Bishya buri munsi',
    fr: 'Frais tous les jours',
  },
  sourcedDirectly: {
    en: 'Sourced directly from local farmers across Rwanda.',
    rw: 'Bivanwa mu baturage mu Rwanda hose.',
    fr: 'Provenant directement des agriculteurs locaux du Rwanda.',
  },
  kigaliDelivery: {
    en: 'Kigali Delivery',
    rw: 'Kugeza Kigali',
    fr: 'Livraison à Kigali',
  },
  doorstepDelivery: {
    en: 'Doorstep delivery within 45 minutes of ordering.',
    rw: 'Kugezwaho iwawe mu minota 45 umaze gutumiza.',
    fr: 'Livraison à domicile dans les 45 minutes suivant la commande.',
  },
  trustedBrand: {
    en: 'Trusted Brand',
    rw: 'Iduka ryizewe',
    fr: 'Marque de confiance',
  },
  servingRwandan: {
    en: 'Serving the Rwandan community for over 20 years.',
    rw: 'Dukorera abanyarwanda imyaka irenga 20.',
    fr: 'Au service de la communauté rwandaise depuis plus de 20 ans.',
  },
  premiumShopping: {
    en: 'Premium Shopping',
    rw: 'Guhaha byo ku rwego rwo hejuru',
    fr: 'Achats de qualité supérieure',
  },
  askAIAssistant: {
    en: 'Ask AI Assistant',
    rw: 'Baza AI',
    fr: 'Demander à l\'assistant IA',
  },
  safeFastSignIn: {
    en: 'Safe & Fast Sign-in',
    rw: 'Kwinjira byihuse kandi byizewe',
    fr: 'Connexion sûre et rapide',
  },
  operationalControlCenter: {
    en: 'Operational Control Center',
    rw: 'Igenzura ry\'imikorere',
    fr: 'Centre de contrôle opérationnel',
  },
  branchManager: {
    en: 'Branch Manager',
    rw: 'Umuyobozi w\'ishami',
    fr: 'Directeur de succursale',
  },
  branchStaff: {
    en: 'Branch Staff',
    rw: 'Umukozi w\'ishami',
    fr: 'Personnel de succursale',
  },
  orders: {
    en: 'Orders',
    rw: 'Komande',
    fr: 'Commandes',
  },
  inventory: {
    en: 'Inventory',
    rw: 'Ibicuruzwa',
    fr: 'Inventaire',
  },
  noOrdersFoundBranch: {
    en: 'No orders found for this branch.',
    rw: 'Nta komande zabonetse kuri iri shami.',
    fr: 'Aucune commande trouvée pour cette succursale.',
  },
  refId: {
    en: 'Ref ID',
    rw: 'Numero',
    fr: 'Réf ID',
  },
  customer: {
    en: 'Customer',
    rw: 'Umukiriya',
    fr: 'Client',
  },
  time: {
    en: 'Time',
    rw: 'Igihe',
    fr: 'Temps',
  },
  assigned: {
    en: 'Assigned',
    rw: 'Yahawe',
    fr: 'Assigné',
  },
  assignToMe: {
    en: 'Assign To Me',
    rw: 'Nyigabanye',
    fr: 'M\'assigner',
  },
  markAsReady: {
    en: 'Mark as Ready',
    rw: 'Yabonetse',
    fr: 'Marquer comme prêt',
  },
  finishOrder: {
    en: 'Finish Order',
    rw: 'Soza komande',
    fr: 'Terminer la commande',
  },
  inventoryControl: {
    en: 'Inventory Control',
    rw: 'Igenzura ry\'ibicuruzwa',
    fr: 'Contrôle des stocks',
  },
  manageProductAvailability: {
    en: 'Manage product availability for',
    rw: 'Genzura ibicuruzwa bihari kuri',
    fr: 'Gérer la disponibilité des produits pour',
  },
  searchItems: {
    en: 'Search items in catalog...',
    rw: 'Shaka ibicuruzwa...',
    fr: 'Rechercher des articles dans le catalogue...',
  },
  addNewProduct: {
    en: 'Add New Product',
    rw: 'Ongeramo igicuruzwa gishya',
    fr: 'Ajouter un nouveau produit',
  },
  catalogIsEmpty: {
    en: 'Catalog is empty.',
    rw: 'Nta bicuruzwa bihari.',
    fr: 'Le catalogue est vide.',
  },
  sku: {
    en: 'SKU',
    rw: 'SKU',
    fr: 'SKU',
  },
  soldOut: {
    en: 'Sold Out',
    rw: 'Byashize',
    fr: 'Épuisé',
  },
  outOfStock: {
    en: 'Out of Stock',
    rw: 'Ntabwo bihari',
    fr: 'Rupture de stock',
  },
  left: {
    en: 'left',
    rw: 'bisigaye',
    fr: 'restants',
  },
  inStock: {
    en: 'in Stock',
    rw: 'Bihari',
    fr: 'en stock',
  },
  newInventory: {
    en: 'New Inventory',
    rw: 'Ibicuruzwa bishya',
    fr: 'Nouvel inventaire',
  },
  fillProductDetails: {
    en: 'Fill in the product details',
    rw: 'Uzuza amakuru y\'igicuruzwa',
    fr: 'Remplissez les détails du produit',
  },
  displayName: {
    en: 'Display Name',
    rw: 'Izina',
    fr: 'Nom d\'affichage',
  },
  saleUnit: {
    en: 'Sale Unit',
    rw: 'Ingano',
    fr: 'Unité de vente',
  },
  unitPrice: {
    en: 'Unit Price (RWF)',
    rw: 'Igiciro (RWF)',
    fr: 'Prix unitaire (RWF)',
  },
  visualIdentity: {
    en: 'Visual Identity',
    rw: 'Ifoto',
    fr: 'Identité visuelle',
  },
  uploadImageFile: {
    en: 'Upload Image File',
    rw: 'Shyiraho ifoto',
    fr: 'Télécharger une image',
  },
  confirmSyncCatalog: {
    en: 'Confirm & Sync Catalog',
    rw: 'Emeza & Bika',
    fr: 'Confirmer et synchroniser le catalogue',
  },
  representative: {
    en: 'Representative',
    rw: 'Uhagarariye Ishami',
    fr: 'Représentant',
  },
  assignedBranch: {
    en: 'Assigned Branch',
    rw: 'Ishami ryawe',
    fr: 'Succursale assignée',
  },
  submitReview: {
    en: 'Submit Review',
    rw: 'Ohereza Igitekerezo',
    fr: 'Soumettre l\'avis',
  },
  leaveReview: {
    en: 'Leave a Review',
    rw: 'Tanga Igitekerezo',
    fr: 'Laisser un avis',
  },
  orderHistory: {
    en: 'Order History',
    rw: 'Amateka ya Komande',
    fr: 'Historique des commandes',
  },
  reviewSubmitted: {
    en: 'Review Submitted',
    rw: 'Igitekerezo Cyoherejwe',
    fr: 'Avis Soumis',
  },
  staffRole: {
    en: 'Staff Role',
    rw: 'Ushinzwe',
    fr: 'Rôle',
  },
  paymentCollected: {
    en: 'Payment will be collected upon delivery or branch pickup.',
    rw: 'Ubishyura uhabwa ibicuruzwa.',
    fr: 'Le paiement sera perçu à la livraison ou au retrait.',
  },
  verifiedSession: {
    en: 'Verified Session',
    rw: 'Konti Yizewe',
    fr: 'Session vérifiée',
  },
  deliveryAddress: {
    en: 'Delivery Address',
    rw: 'Aho kubigeza',
    fr: 'Adresse de livraison',
  },
  phoneNumber: {
    en: 'Phone Number',
    rw: 'Numero ya Terefone',
    fr: 'Numéro de téléphone',
  },
  aiAssistant: {
    en: 'AI Assistant',
    rw: 'Ubufasha bwa AI',
    fr: 'Assistant IA',
  },
  clearResults: {
    en: 'Clear Results',
    rw: 'Siba ibyabonetse',
    fr: 'Effacer les résultats',
  },
  discover: {
    en: 'Discover',
    rw: 'Vumbura',
    fr: 'Découvrir',
  },
  aboutUs: {
    en: 'About Us',
    rw: 'Abo turibo',
    fr: 'À propos de nous',
  },
  careers: {
    en: 'Careers',
    rw: 'Akazi',
    fr: 'Carrières',
  },
  help: {
    en: 'Help',
    rw: 'Ubufasha',
    fr: 'Aide',
  },
  faq: {
    en: 'FAQ',
    rw: 'Ibibazo bikunze kubazwa',
    fr: 'FAQ',
  },
  privacyPolicy: {
    en: 'Privacy Policy',
    rw: 'Amabwiriza y\'ibanga',
    fr: 'Politique de confidentialité',
  },
  terms: {
    en: 'Terms',
    rw: 'Amategeko',
    fr: 'Conditions',
  },
  backToResults: {
    en: 'Back to Results',
    rw: 'Subira inyuma',
    fr: 'Retour aux résultats',
  },
  description: {
    en: 'Description',
    rw: 'Ibisobanuro',
    fr: 'Description',
  },
  unit: {
    en: 'Unit',
    rw: 'Igipimo',
    fr: 'Unité',
  },
  category: {
    en: 'Category',
    rw: 'Icyiciro',
    fr: 'Catégorie',
  },
  allRightsReserved: {
    en: 'All rights reserved.',
    rw: 'Uburenganzira bwose burabitswe.',
    fr: 'Tous droits réservés.',
  },
  aboutUsContent: {
    en: 'Simba Supermarket is Rwanda\'s leading retail chain, dedicated to providing fresh products and premium service to our community since 1990.',
    rw: 'Simba Supermarket niyo muryango wa mbere w-ubucuruzi mu Rwanda, wiyemeje kugeza ku baturage ibicuruzwa bishya n-ubufasha buhebuje kuva mu 1990.',
    fr: 'Simba Supermarché est la principale chaîne de vente au détail du Rwanda, dédiée à la fourniture de produits frais et d\'un service premium à notre communauté depuis 1990.',
  },
  careersContent: {
    en: 'Join the Simba family! We are always looking for passionate individuals to join our branch teams and delivery network.',
    rw: 'Injira mu muryango wa Simba! Turahora dushaka abantu bafite ishyaka ryo gukora mu makipe y-amashami yacu no mu bageza ibicuruzwa ku bakiriya.',
    fr: 'Rejoignez la famille Simba ! Nous sommes toujours à la recherche de personnes passionnées pour rejoindre nos équipes en succursale et notre réseau de livraison.',
  },
  faqContent: {
    en: 'Find answers to common questions about orders, payments, and branch locations.',
    rw: 'Sanga ibisubizo by-ibibazo bikunze kubazwa ku bijyanye na komande, ubwishyu, n-aho amashami yacu aherereye.',
    fr: 'Trouvez des réponses aux questions courantes sur les commandes, les paiements et l\'emplacement des succursales.',
  },
  privacyPolicyContent: {
    en: 'Your privacy is important to us. We protect your data and ensure safe transactions across all Simba platforms.',
    rw: 'Uburenganzira bwawe ni ingenzi kuri twe. Turinda amakuru yawe kandi tukizera ko ubwishyu bwose bukorwa mu mutekano kuri Simba.',
    fr: 'Votre vie privée est importante pour nous. Nous protégeons vos données et assurons des transactions sécurisées sur toutes les plateformes Simba.',
  },
  termsContent: {
    en: 'By using our service, you agree to Simba Supermarket\'s terms and conditions regarding orders and deliveries.',
    rw: 'Iyo ukoresheje serivisi zacu, uba wemeye amategeko n-amabwiriza ya Simba Supermarket yerekeye komande no kugeza ibintu ku bakiriya.',
    fr: 'En utilisant notre service, vous acceptez les termes et conditions de Simba Supermarché concernant les commandes et les livraisons.',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('simba_language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('simba_language', language);
  }, [language]);

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
