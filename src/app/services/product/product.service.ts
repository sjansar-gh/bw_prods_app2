import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../../models/product';
import { API_URL } from '../../constants/tw_contants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiURL= API_URL;
  httpClient:HttpClient;

  constructor(httpClient: HttpClient) { 
    this.httpClient = httpClient;
  }

  getProducts(skuSelected:string | 'FF611EP'){
    let sku = skuSelected;
    let product = this.httpClient.get<Product>(this.apiURL + "products/" + sku, { withCredentials: true })
    console.log(product);
    return product;
  }

  getSKUs(skuStr:string){
    let skuArr = this.httpClient.get<string[]>(this.apiURL + "skus/" + skuStr)
    console.log(skuArr);
    return skuArr;
  }

  editProduct(prodFields: any){
    let sku = prodFields.sku;
    console.log('prodFields - ', prodFields);
    let paramSKU = new HttpParams().set('sku', sku);

    let putResp = this.httpClient.put<string>(this.apiURL + "products/update", prodFields, { params: paramSKU });
    return putResp;
  }

  getAllUniqueCategories(){
    let categoryList = this.httpClient.get<string[]>(this.apiURL + "unique_categories")
    console.log(categoryList);
    return categoryList;
  }

  getProductsByCategory(categoriesSelected: string){
    let paramCategory = new HttpParams().set('category', categoriesSelected);
    let products = this.httpClient.get<Product[]>(this.apiURL + "categories", { params: paramCategory })
    console.log(products);
    return products;
  }

  getExcelSheet(){
    return this.httpClient.get(this.apiURL + "download/excel_sheet", {
      responseType: 'blob'
    });
  }

  postExcelSheet(formData: FormData){
    return this.httpClient.post(this.apiURL + 'upload/data_sheet', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

}
