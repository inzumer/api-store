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

export const UserReviewExample = {
  first_name: 'John',
  last_name: 'Doe',
  nickname: 'johndoe',
  profile_photo: 'https://example.com/photo.jpg',
};

export const UserReviewCompleteExample = {
  id: '60c72b2f9b1e8d001c8e4f3a',
  ...UserReviewExample,
};

export const ReviewExample = {
  user: UserReviewExample,
  rating: 5,
  comment: 'Excellent product!',
  created_at: '2023-10-01T00:00:00Z',
  vote_affirmative: 5,
  vote_negative: 170,
};

export const ReviewCompleteExample = {
  user: UserReviewCompleteExample,
  rating: 5,
  comment: 'Excellent product!',
};

export const ProductExample = {
  id: '12345',
  ...PartialProductExample,
  description: 'A handcrafted mate cup made from algarrobo wood.',
  stock: 50,
  is_active: true,
  created_at: '2023-10-01T00:00:00Z',
  updated_at: '2023-10-01T00:00:00Z',
  score: 5,
  reviews: [ReviewExample],
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
