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
  allRightsReserved: {
    en: 'All rights reserved.',
    rw: 'Uburenganzira bwose burabitswe.',
    fr: 'Tous droits réservés.',
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
