export class ProductService {
  constructor() {}

  createProduct(product: string) {
    return `Create product: ${product}`;
  }

  getProduct(product: string) {
    return `Get product: ${product}`;
  }

  updateProduct(product: string) {
    return `Update product: ${product}`;
  }

  deleteProduct(product: string) {
    return `Delete product: ${product}`;
  }
}
