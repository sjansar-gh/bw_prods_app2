import { Component, signal, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product/product.service';
import { Product } from '../models/product';
import { NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { SkuAutoComponent } from "../components/sku-auto/sku-auto.component";
import { Router, ActivatedRoute } from '@angular/router';
import { IdleService } from '../services/idle/idle.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [NgIf, MatInputModule, MatIconModule, SkuAutoComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  
  product = {} as Product;
  skus: string[] = [];

  //signal
  sharedSku = signal('FF611EP');
  //

  //Idleness logic
  idleService = inject(IdleService);
  private idleSubscription?: Subscription;
  private idleCount = 0;
  
  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService, private router: Router){
    effect(() => {
      this.getProduct(this.sharedSku())
    });
  }

  ngOnInit(){

    //TODO
    let skuSelected: string = this.activatedRoute.snapshot.paramMap.get('sku')!;
    if(skuSelected){
      console.log('skuSelected', skuSelected);
      this.sharedSku.set(skuSelected);
    }

    //Check app idleness
    this.checkAppIdleness();
  }

  getProduct(skuSelected:string){
    this.productService.getProducts(skuSelected).subscribe( (result) => {
      // console.log(result);
      this.product=result;
      //console.log(this.product);
    });
  }

  getSkUs(skuStr:string){
    this.productService.getSKUs(skuStr).subscribe( (result) => {
      //console.log(result);
      if(result){
        this.skus=result;
        console.log('totals skus: ', this.skus.length);
      }
    })
  }

  editProduct(){
    this.router.navigate(['/edit', this.product.sku]);
  }

  newProduct(){
    this.router.navigate(['/new']);
  }

  productList(){
    this.router.navigate(['/list']);
  }

  checkAppIdleness(){
    this.idleSubscription = this.idleService.idleState.subscribe( (isIdle) => {
      if(isIdle){
        console.log('user is idle');
        this.idleCount +=1;
        if(this.idleCount > 5){
          console.log('Logging out ...');
          this.router.navigate(['/login']);
          localStorage.removeItem("tw_user");
          this.idleCount = 0;
        }
      }else{
        console.log('user is active');
        this.idleCount = 0;
      }
    })
  }

  onUserAction(){
    this.idleService.resetTimer();
  }

  ngOnDestroy(): void {
    if(this.idleSubscription){
      this.idleSubscription?.unsubscribe();
    }
  }

}
