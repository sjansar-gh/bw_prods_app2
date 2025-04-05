import { Component, inject, Input, OnInit, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService } from '../../services/product/product.service';

@Component({
  selector: 'app-sku-auto',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './sku-auto.component.html',
  styleUrl: './sku-auto.component.css'
})
export class SkuAutoComponent {
  productService = inject(ProductService);

  //Signal
  @Input() sharedSku!: WritableSignal<string>;
  
  updateValue(skuSelected:string) {
    this.sharedSku.set(skuSelected);
  }
  //

  skuInput = new FormControl('');
  //options: string[] = ["FF611EP","FF612","FF613","FF62","FF71PCB","FF72PCB","FF73PCB","FF74","FF75","FF80L"];
  filteredOptions: Observable<string[]> | undefined;
  skus: string[] = [];

  ngOnInit() {
    // this.options.push('Twelve', 'Twenty');
    this.filteredOptions = this.skuInput.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _filter(value: string): string[] {
    if(value){
      const filterValue = value.toLowerCase();
      this.getSkUs(filterValue);

      return this.skus.filter((option) =>
        option.toLowerCase().includes(filterValue)
      );
    }else return [];
  }

  getSkUs(skuStr:string){
    this.productService.getSKUs(skuStr).subscribe( (result) => {
      //console.log(result);
      if(result){
        this.skus=result;
        console.log('total skus: ', this.skus.length);
      }
    })
  }

  show(skuSelected:string){
    //alert(skuSelected);
    this.updateValue(skuSelected);
  }
}
