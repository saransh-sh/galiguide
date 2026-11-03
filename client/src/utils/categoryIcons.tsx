import React from 'react';
import {
  Utensils,
  Coffee,
  Hammer,
  Key,
  Scissors,
  Apple,
  Shirt,
  Flower2,
  Bike,
  Flame,
  Store,
} from 'lucide-react';

interface CategoryIconProps {
  iconName?: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ iconName, className = 'w-5 h-5', size = 20 }: CategoryIconProps) {
  switch (iconName?.toLowerCase()) {
    case 'utensils':
    case 'street-food':
      return <Utensils className={className} size={size} />;
    case 'coffee':
    case 'chai-beverages':
      return <Coffee className={className} size={size} />;
    case 'hammer':
    case 'cobbler':
      return <Hammer className={className} size={size} />;
    case 'key':
    case 'key-maker':
      return <Key className={className} size={size} />;
    case 'scissors':
    case 'knife-sharpener':
      return <Scissors className={className} size={size} />;
    case 'apple':
    case 'fruits-vegetables':
      return <Apple className={className} size={size} />;
    case 'shirt':
    case 'tailor-alteration':
      return <Shirt className={className} size={size} />;
    case 'flower-2':
    case 'flower':
    case 'flower-vendor':
      return <Flower2 className={className} size={size} />;
    case 'bike':
    case 'cycle-repair':
      return <Bike className={className} size={size} />;
    case 'flame':
    case 'pottery-artisan':
      return <Flame className={className} size={size} />;
    default:
      return <Store className={className} size={size} />;
  }
}
