export const PartialProductExample = {
  name: 'Mate Imperial',
  price: 1500,
  category_id: '60c72b2f9b1e8d001c8e4f3a',
  images: [
    'https://example.com/images/mate-imperial-1.jpg',
    'https://example.com/images/mate-imperial-2.jpg',
  ],
  owner: '60c72b2f9b1e8d001c8e4f3b',
  currency: 'USD',
};

export const ProductExample = {
  id: '12345',
  ...PartialProductExample,
  description: 'A handcrafted mate cup made from algarrobo wood.',
  stock: 50,
  is_active: true,
  created_at: '2023-10-01T00:00:00Z',
  updated_at: '2023-10-01T00:00:00Z',
};

export const SoftDeleteExample = {
  id: '12345',
  ...PartialProductExample,
  description: 'A handcrafted mate cup made from algarrobo wood.',
  stock: 50,
  is_active: false,
  created_at: '2023-10-01T00:00:00Z',
  updated_at: '2023-10-01T00:00:00Z',
};

export const UpdateProductExample = {
  id: '12345',
  ...PartialProductExample,
  description: 'Update description for the product.',
  stock: 100,
  is_active: true,
  created_at: '2023-10-01T00:00:00Z',
  updated_at: '2023-10-01T00:00:00Z',
};
