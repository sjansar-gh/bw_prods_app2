import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../../models/product';
import { API_URL } from '../../constants/tw_contants';
import { timeout } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  apiURL= API_URL;
  httpClient:HttpClient;
  THREE_MINUTES: number = 3 * 60 * 1000;

  constructor(httpClient: HttpClient) { 
    this.httpClient = httpClient;
  }

  //get product by sku
  getProducts(skuSelected:string | 'FF611EP'){
    let sku = skuSelected;
    let product = this.httpClient.get<Product>(this.apiURL + "products/" + sku, { withCredentials: true })
    //console.log(product);
    return product;
  }

  //get skus by regular expression
  getSKUs(skuStr:string){
    let skuArr = this.httpClient.get<string[]>(this.apiURL + "skus/" + skuStr)
    //console.log(skuArr);
    return skuArr;
  }

  //update product
  editProduct(prodFields: any){
    let sku = prodFields.sku;
    //console.log('prodFields - ', prodFields);
    let paramSKU = new HttpParams().set('sku', sku);

    let putResp = this.httpClient.put<string>(this.apiURL + "products/update", prodFields, { params: paramSKU });
    return putResp;
  }

  //get all unique categories
  getAllUniqueCategories(){
    let categoryList = this.httpClient.get<string[]>(this.apiURL + "unique_categories")
    //console.log(categoryList);
    return categoryList;
  }

  //get products by category
  getProductsByCategory(categoriesSelected: string){
    let paramCategory = new HttpParams().set('category', categoriesSelected);
    let products = this.httpClient.get<Product[]>(this.apiURL + "categories", { params: paramCategory })
    //console.log(products);
    return products;
  }

  //download excel sheet
  getExcelSheet(){
    return this.httpClient.get(this.apiURL + "download/excel_sheet", {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events'
    }).pipe(timeout(this.THREE_MINUTES));
  }

  //upload excel sheet
  postExcelSheet(formData: FormData){
    return this.httpClient.post(this.apiURL + 'upload/data_sheet', formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(timeout(this.THREE_MINUTES));
  }

  //get request to convert uploaded excel sheet to json file on the server
  convertToJson(excel_sheet_name: string){
    let params = new HttpParams().set('sheet', excel_sheet_name);
    const resp = this.httpClient.get(this.apiURL + "upload/convertToJson", { params });
    return resp;
  }

  //get request to start json file insert to MDB
  insertJsonToDB(){
    const resp = this.httpClient.get(this.apiURL + "upload/insertToDB");
    return resp;
  }

}
