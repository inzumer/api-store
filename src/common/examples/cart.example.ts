export const CartExample = {
  type: 'object',
  properties: {
    productId: { type: 'string', example: 'abc123' },
    quantity: { type: 'number', example: 5 },
  },
  required: ['productId', 'quantity'],
};
