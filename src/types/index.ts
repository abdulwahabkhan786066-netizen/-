export type Language = 'ur' | 'en';

export type Category = 
  | 'tractors' 
  | 'solar_tubewells' 
  | 'harvesters' 
  | 'seeds_fertilizers' 
  | 'implements' 
  | 'sprayers' 
  | 'livestock';

export type ItemCondition = 'new' | 'used' | 'reconditioned';

export type ListingType = 'sale' | 'rent';

export interface Review {
  id: string;
  targetId: string; // product id or seller id
  targetType: 'product' | 'seller';
  authorName: string;
  authorCity: string;
  rating: number; // 1 to 5
  comment: string;
  commentUrdu?: string;
  date: string;
  verifiedFarmer: boolean;
  helpfulCount: number;
}

export interface Seller {
  id: string;
  name: string;
  nameUrdu: string;
  phone: string;
  whatsapp: string;
  city: string;
  cityUrdu: string;
  verified: boolean;
  memberSince: string;
  totalDeals: number;
  rating: number;
  totalReviews: number;
  responseTime: string;
  responseTimeUrdu: string;
}

export interface Listing {
  id: string;
  title: string;
  titleUrdu: string;
  category: Category;
  price: number;
  priceType?: 'fixed' | 'negotiable';
  type: ListingType;
  rentRateUnit?: string; // e.g. "فی گھنٹہ" / "فی ایکڑ"
  condition: ItemCondition;
  city: string;
  cityUrdu: string;
  image: string;
  gallery?: string[];
  description: string;
  descriptionUrdu: string;
  specs: {
    label: string;
    labelUrdu: string;
    value: string;
    valueUrdu: string;
  }[];
  seller: Seller;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  featured?: boolean;
}

export interface MandiRate {
  id: string;
  commodity: string;
  commodityUrdu: string;
  mandi: string;
  mandiUrdu: string;
  pricePerMaund: number; // per 40kg (من)
  change: number; // + or -
  date: string;
}
