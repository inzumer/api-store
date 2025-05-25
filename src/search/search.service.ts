export class SearchService {
  constructor() {}

  searchProduct(product: string) {
    return `This is a search for ${product}`;
  }

  searchProductByCategory(category: string) {
    return `This is the category: ${category}`;
  }

  searchProductByOwner(owner: string) {
    return `This is the owner selected: ${owner}`;
  }
}
