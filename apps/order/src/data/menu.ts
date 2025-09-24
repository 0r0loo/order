import type {MenuData} from '../types/menu';

export const menuData: MenuData = {
  categories: [
    {
      id: 'beer',
      name: '맥주',
      emoji: '🍺',
      items: [
        {
          id: 'cass-draft',
          name: '카스 생맥주',
          description: '시원한 생맥주',
          price: 5000,
          icon: '🍺',
          category: 'beer',
          available: true
        },
        {
          id: 'hite-draft',
          name: '하이트 생맥주',
          description: '부드러운 생맥주',
          price: 5000,
          icon: '🍺',
          category: 'beer',
          available: true
        },
        {
          id: 'cloud-draft',
          name: '클라우드 생맥주',
          description: '깔끔한 맛',
          price: 5500,
          icon: '🍺',
          category: 'beer',
          available: true
        }
      ]
    },
    {
      id: 'soju',
      name: '소주',
      emoji: '🍶',
      items: [
        {
          id: 'chamisul',
          name: '참이슬',
          description: '깔끔한 소주',
          price: 4000,
          icon: '🍶',
          category: 'soju',
          available: true
        },
        {
          id: 'jinro',
          name: '진로',
          description: '부드러운 맛',
          price: 4000,
          icon: '🍶',
          category: 'soju',
          available: true
        },
        {
          id: 'cheoeum-cheoreom',
          name: '처음처럼',
          description: '순한 맛',
          price: 4200,
          icon: '🍶',
          category: 'soju',
          available: true
        }
      ]
    },
    {
      id: 'food',
      name: '안주',
      emoji: '🍖',
      items: [
        {
          id: 'pork-belly',
          name: '삼겹살',
          description: '신선한 삼겹살 (200g)',
          price: 15000,
          icon: '🥓',
          category: 'food',
          available: true
        },
        {
          id: 'kimchi-jjim',
          name: '김치찜',
          description: '매콤한 김치찜',
          price: 8000,
          icon: '🥬',
          category: 'food',
          available: true
        },
        {
          id: 'chicken',
          name: '치킨',
          description: '바삭한 치킨 (반마리)',
          price: 12000,
          icon: '🧀',
          category: 'food',
          available: true
        },
        {
          id: 'squid-stir-fry',
          name: '오징어볶음',
          description: '매콤달콤 오징어볶음',
          price: 10000,
          icon: '🦑',
          category: 'food',
          available: true
        },
        {
          id: 'dry-snack',
          name: '마른안주',
          description: '견과류 + 오징어',
          price: 6000,
          icon: '🥜',
          category: 'food',
          available: true
        },
        {
          id: 'mushroom-jeon',
          name: '버섯전',
          description: '고소한 버섯전',
          price: 7000,
          icon: '🍄',
          category: 'food',
          available: true
        },
        {
          id: 'grilled-fish',
          name: '생선구이',
          description: '고등어구이',
          price: 9000,
          icon: '🐟',
          category: 'food',
          available: true
        },
        {
          id: 'doenjang-jjigae',
          name: '된장찌개',
          description: '구수한 된장찌개',
          price: 6000,
          icon: '🍲',
          category: 'food',
          available: true
        }
      ]
    }
  ]
};