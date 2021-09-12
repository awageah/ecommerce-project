import { HtmlAstPath } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  // templateUrl: './product-list.component.html',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];

  currentCategoryId: number = 1;
  previousCategoryId: number = 1;

  searchMode: boolean = false;

  // pagination properties
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  previousKeyword: string = null;

  constructor(private productService: ProductService, private cartService: CartService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }

  }

  handleListProducts() {
    // check if "id" paramter is available
    if (this.activatedRoute.snapshot.paramMap.has('id')) {
      this.currentCategoryId = + this.activatedRoute.snapshot.paramMap.get('id');
    } else {
      // setting default category id to 1
      this.currentCategoryId = 1;
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productService.getProductListPaginated(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(
      this.processResult()
    );
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }

  handleSearchProducts() {
    const keyword: string = this.activatedRoute.snapshot.paramMap.get('keyword');

    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }
    this.previousKeyword = keyword;

    this.productService.searchProductsPaginated(this.pageNumber - 1, this.pageSize, keyword).subscribe(
      this.processResult()
    );
  }

  updatePageSize(event: any) {
    const element = event.currentTarget as HTMLInputElement
    this.pageSize = +element.value
    this.pageNumber = 1;
    this.listProducts();
  }

  addToCart(product: Product) {
    console.log(`Adding to cart ${product.name} : ${product.unitPrice}`);

    this.cartService.addToCart(new CartItem(product));
  }

}
