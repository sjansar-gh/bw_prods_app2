import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product';
import { map } from 'rxjs';

@Component({
  selector: 'app-edit',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent {

  productForm = new FormGroup({
    sku: new FormControl(""),
    attribute_set_code: new FormControl(""),
    categories: new FormControl(""),
    name: new FormControl(""),
    description: new FormControl(""),
    weight: new FormControl("0"),
    price: new FormControl("0.00"),
    meta_title: new FormControl(""),
    meta_description: new FormControl(""),
    gtin: new FormControl(""),
    brand: new FormControl(""),
    product_brand: new FormControl(""),
    delivery_information: new FormControl(""),
    exclude_from_google_feed: new FormControl(""),
    finish: new FormControl(""),
    google_custom_label_0: new FormControl(""),
    google_custom_label_1: new FormControl(""),
    google_title: new FormControl(""),
    google_product_category: new FormControl(""),
    product_type_0: new FormControl(""),
    product_type_1: new FormControl(""),
    size: new FormControl(""),
    backset_size: new FormControl(""),
    fixing_centre: new FormControl(""),
    style: new FormControl(""),
    unit: new FormControl(""),
    related_skus: new FormControl(""),
    related_position: new FormControl(""),
    upsell_skus: new FormControl(""),
    upsell_position: new FormControl(""),
  });

  editSku: string = '';
  editProduct = {} as Product;
  update_response?: any = null;

  constructor(private activatedRoute: ActivatedRoute, private productService: ProductService){

  }

  ngOnInit(){
    this.editSku = this.activatedRoute.snapshot.paramMap.get('sku')!;
    console.log('editSku = ', this.editSku);
    this.getProduct(this.editSku);
  }

  updateForm(){
    this.productForm.get('sku')?.setValue(this.editProduct.sku);
    this.productForm.get('attribute_set_code')?.setValue(this.editProduct.attribute_set_code);
    this.productForm.get('categories')?.setValue(this.editProduct.categories);
    this.productForm.get('name')?.setValue(this.editProduct.name);
    this.productForm.get('description')?.setValue(this.editProduct.description);
    this.productForm.get('weight')?.setValue(this.editProduct.weight?.toString());
    this.productForm.get('price')?.setValue(this.editProduct.price?.toString());
    this.productForm.get('meta_title')?.setValue(this.editProduct.meta_title);
    this.productForm.get('meta_description')?.setValue(this.editProduct.meta_description);

    this.productForm.get('gtin')?.setValue(this.editProduct.gtin?.toString());
    this.productForm.get('brand')?.setValue(this.editProduct.brand);
    this.productForm.get('product_brand')?.setValue(this.editProduct.product_brand);
    this.productForm.get('delivery_information')?.setValue(this.editProduct.delivery_information);
    this.productForm.get('exclude_from_google_feed')?.setValue(this.editProduct.exclude_from_google_feed);
    this.productForm.get('finish')?.setValue(this.editProduct.finish);
    this.productForm.get('google_custom_label_0')?.setValue(this.editProduct.google_custom_label_0);
    this.productForm.get('google_custom_label_1')?.setValue(this.editProduct.google_custom_label_1);
    this.productForm.get('google_title')?.setValue(this.editProduct.google_title);
    this.productForm.get('google_product_category')?.setValue(this.editProduct.google_product_category);
    this.productForm.get('product_type_0')?.setValue(this.editProduct.product_type_0);
    this.productForm.get('product_type_1')?.setValue(this.editProduct.product_type_1);
    this.productForm.get('size')?.setValue(this.editProduct.size);
    this.productForm.get('backset_size')?.setValue(this.editProduct.backset_size);
    this.productForm.get('fixing_centre')?.setValue(this.editProduct.fixing_centre);
    this.productForm.get('style')?.setValue(this.editProduct.style);
    this.productForm.get('unit')?.setValue(this.editProduct.unit);
    this.productForm.get('related_skus')?.setValue(this.editProduct.related_skus);
    this.productForm.get('related_position')?.setValue(this.editProduct.related_position);
    this.productForm.get('upsell_skus')?.setValue(this.editProduct.upsell_skus);
    this.productForm.get('upsell_position')?.setValue(this.editProduct.upsell_position);
  
    //
    this.productForm.controls.backset_size.value;
  }

  onSubmit(){
    let changedFields: any = this.getDirtyValues(this.productForm);
    if(changedFields && changedFields.size > 0){
      console.log('productForm: ');
      console.log(this.productForm.value);

      changedFields = Object.fromEntries(changedFields);
      console.log('changedFields - ', changedFields);
      this.editTheProduct(changedFields);
    }else{
      alert('Product has no change to update');
    }
  }

  getDirtyValues(form: any): Map<any, any> {
    let dirtyValues = new Map();

    Object.keys(form.controls).forEach( (key: string) => {
            let currentControl = form.controls[key];

            if (currentControl.dirty) {
                dirtyValues.set(key, currentControl.value);
            }
        });
    if(dirtyValues.size > 0){
      //console.log(dirtyValues);
      dirtyValues.set('sku', form.controls['sku'].value);
      console.log(Object.fromEntries(dirtyValues));
    }
    return dirtyValues;
  }

  markPristine(){
    Object.values(this.productForm.controls).forEach(control => {
      control.markAsPristine();
    });
  }

  getProduct(skuSelected:string){
    //console.log('-> getProduct()');
    this.productService.getProducts(skuSelected).subscribe( (result) => {
      //console.log(result);
      this.editProduct=result;
      //console.log(this.editProduct);
      this.updateForm();
    });
  }

  editTheProduct(prodObj: any){
    this.productService.editProduct(prodObj).subscribe( (putResp) => {
      console.log('putResp = ', putResp);
      this.update_response = putResp;

      //
      alert('Product ' + this.update_response.msg);
      this.markPristine();
    });
  }

}
