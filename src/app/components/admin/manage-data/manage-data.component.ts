import { Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpEventType } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-manage-data',
  imports: [ 
    MatTooltipModule, 
    MatFormFieldModule, 
    MatInputModule, 
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressBarModule,
    NgIf
   ],
  templateUrl: './manage-data.component.html',
  styleUrl: './manage-data.component.css'
})
export class ManageDataComponent {
  fileName: String = '';
  uploadProgress: number = 0;
  selectedFile: File | null = null;
  //fileDownloaded: boolean = false;
  private _snackBar = inject(MatSnackBar);

  constructor(private productService: ProductService){

  }

  downloadData(){
    this.productService.getExcelSheet().subscribe( (file_blob: Blob) => {
      if(file_blob){
        const url = window.URL.createObjectURL(file_blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'product_data_sheet.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        console.log('Excel sheet downloaded.');
        //this.fileDownloaded = true;
        this.displaySnackbar('Excel sheet downloaded successfully');
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
    this.uploadProgress = 0;
  }

  uploadFile(){
    if(this.selectedFile){
      const formData = new FormData();
      formData.append('file_name', this.selectedFile);

      this.productService.postExcelSheet(formData).subscribe( (event) => {
        if(event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total!);
          console.log('uploadProgress = ', this.uploadProgress);
        }else if (event.type === HttpEventType.Response) {
          console.log('File uploaded successfully');
          this.displaySnackbar('File uploaded successfully');
          this.selectedFile = null;
        }
      });
    }
  }

  displaySnackbar(msg: string){
    //console.log(resp);
    if(msg){
      this._snackBar.open(msg, "OK", {
        duration: 3000,
        panelClass: ['tw_snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

}
