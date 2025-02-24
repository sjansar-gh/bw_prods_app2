import { Component } from '@angular/core';
import { ProductService } from '../../services/product/product.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  imports: [ 
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    CommonModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  categories: string[] = [];
  selectedCategory: string = "";
  productsByCategory: Product[] = [];

  constructor(private prodService: ProductService, private router: Router){
  }

  ngOnInit(){
    this.getCategories();
  }

  getCategories(){
    this.prodService.getAllUniqueCategories().subscribe( (catList) => {
      this.categories = catList;
      console.log(this.categories);
    })
  }

  getProductByCategory(event: any){
    console.log(event.value);
    if(this.selectedCategory){
      this.prodService.getProductsByCategory(this.selectedCategory)
      .subscribe( (products) => {
        this.productsByCategory = products;
        console.log('Total products = ', this.productsByCategory.length);
      });
    }
  }

  editProduct(skuSelected: string){
    if(skuSelected)
      this.router.navigate(['/products/', skuSelected]);
  }
}
