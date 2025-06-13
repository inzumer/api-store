export const EmailExample = {
  email: 'martin.rodriguez@example.com',
};

export const LoginExample = {
  ...EmailExample,
  password: '$2b$10$9TxKwzsweI5vAVLpNFI4',
};

export const PartialUserExample = {
  nickname: 'tinchito133',
  first_name: 'Martin',
  last_name: 'Rodriguez',
  ...LoginExample,
  role: 'user',
  gender: 'Male',
  birthday: '1985-12-30T00:00:00.000Z',
};

export const UserExample = {
  _id: '684471f278939b7fa540eb53',
  ...PartialUserExample,
  user_state: false,
  is_active: true,
  created_at: '2025-06-07T17:08:02.794Z',
  updated_at: '2025-06-07T17:08:02.794Z',
  last_conection: '2025-06-07T17:08:02.794Z',
};

export const UserCartExample = {
  ...UserExample,
  cart: [
    {
      productId: '683981260321fcf5b6ee6d31',
      quantity: 4,
      _id: '68482058633045a7e05b61ec',
    },
    {
      productId: '683dac28bf9f098a4be43556',
      quantity: 1,
      _id: '684820bcf315fd7c0ce2e280',
    },
  ],
};

export const UserCartEmptyExample = {
  ...UserExample,
  cart: [],
};

export const UserWishlistExample = {
  ...UserExample,
  wishlist: ['683dac02bf9f098a4be4354a'],
};

export const UserWishlistEmptyExample = {
  ...UserExample,
  wishlist: [],
};
