export const PartialCategoryExample = {
  name: 'Electronics',
  description:
    'Electronic devices like headphones, smartwatches, and speakers.',
};

export const CategoryExample = {
  id: '60c72b2f9b1e8d001c8e4f3a',
  ...PartialCategoryExample,
  is_active: true,
  created_at: '2023-10-01T00:00:00Z',
  updated_at: '2023-10-01T00:00:00Z',
};

export const UpdateCategoryExample = {
  id: '60c72b2f9b1e8d001c8e4f3a',
  ...PartialCategoryExample,
  description: 'Updated description for the electronics category.',
  created_at: '2023-10-01T00:00:00Z',
  updated_at: '2023-10-01T00:00:00Z',
};

export const SoftDeleteExample = {
  id: '60c72b2f9b1e8d001c8e4f3a',
  ...PartialCategoryExample,
  created_at: '2023-10-01T00:00:00Z',
  updated_at: '2023-10-01T00:00:00Z',
  is_active: false,
};
