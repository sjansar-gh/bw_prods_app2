import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';


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
    MatProgressSpinnerModule,
    NgIf
  ],
  templateUrl: './manage-data.component.html',
  styleUrl: './manage-data.component.css'
})
export class ManageDataComponent implements AfterViewInit {
  fileName: String = '';
  _u_value: number = 0;
  selectedFile: File | null = null;
  show_d_spinner = false;
  show_u_spinner = false;
  _d_value: number = 0;
  private _snackBar = inject(MatSnackBar);
  formStepsNum: number = 0;
  disable_btns: boolean[] = [true, true, true];
  u_action_btns: boolean[] = [true, true, true];
  excel_file_name: string = "";


  constructor(private productService: ProductService, private _elementRef: ElementRef, private router: Router) {

  }

  ngAfterViewInit(): void {
    this.noCursor();
  }

  downloadData() {
    const dt_tim_str =
      new Date().toLocaleDateString().replaceAll('/', '_') + '_' +
      new Date().toLocaleTimeString().replaceAll(':', '_').split(' ')[0];
    this.show_d_spinner = true;
    this.productService.getExcelSheet().subscribe((event: HttpEvent<Blob>) => {
      if (event) {
        console.log('event: ', event);
        if (event.type) {
          switch (event.type) {
            case HttpEventType.DownloadProgress:
              //download progress
              const percentDone = Math.round(100 * event.loaded / (event.total || 1));
              console.log(`File is ${percentDone}% downloaded.`);
              this._d_value = percentDone;
              break;
            case HttpEventType.Response:
              console.log('File is completely downloaded!');
              const file_blob = event.body;
              //save the blob data
              const dt_tim_str =
                new Date().toLocaleDateString().replaceAll('/', '_') + '_' +
                new Date().toLocaleTimeString().replaceAll(':', '_').split(' ')[0];
              if (file_blob) {
                saveAs(file_blob, `product_sheet_${dt_tim_str}.xlsx`)
                console.log('Excel sheet downloaded.');
                this.show_d_spinner = false;
                this._d_value = 0;
                this.displaySnackbar('Excel sheet downloaded successfully');
              }
              break;
          }
        }
      }
      return true;
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this._u_value = 0;
      this.yesCursor();
      this.u_action_btns[0] = false;
    }
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file_name', this.selectedFile);
      this.show_u_spinner = true;
      this.disable_btns[0] = false;

      this.productService.postExcelSheet(formData).subscribe((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          this._u_value = Math.round(100 * event.loaded / event.total!);
          console.log('uploadProgress = ', this._u_value);
        } else if (event.type === HttpEventType.Response) {
          console.log('File uploaded successfully');
          console.log(JSON.stringify(event.body));
          let resp = event.body;
          //{ "status":"success",
          // "msg":"File product_sheet_4_1_2025_8_34_29.xlsx uploaded successfully"}
          if (resp && resp.status === 'success') {
            this.excel_file_name = resp.msg.split(' ')[1];
          }
          this.displaySnackbar('File uploaded successfully');
          this.selectedFile = null;
          // this._u_value = 0;
          // this.show_u_spinner = false;
          // this.noCursor();
          // this.clearFileInput();
          // this.u_action_btns[0] = true; //disable
          // this.u_action_btns[1] = false; //enable next action
          // this.disable_btns[0] = false; //enable next
          // this.showUplStatusMsg(resp.status);
          setTimeout(() => {
            this._u_value = 0;
            this.show_u_spinner = false;

            this.noCursor();
            this.clearFileInput();
            this.u_action_btns[0] = true; //disable
            this.u_action_btns[1] = false; //enable next action
            this.disable_btns[0] = false; //enable next
            this.showUplStatusMsg(resp.status);
          }, 2000);
        }
      });
    }
  }

  convertExcelToJson() {
    if (this.excel_file_name) {
      this.u_action_btns[1] = false; //enable
      this.show_u_spinner = true;
      this._u_value = 0;
      let sheet_name: string = this.excel_file_name;
      this.productService.convertToJson(sheet_name).subscribe((resp: any) => {
        console.log(JSON.stringify(resp));
        //{"status":"success","msg":"excel sheet converted to json successfully"}
        if (resp && resp.status === 'success') {
          this._u_value = 100;
          // this.u_action_btns[1] = true; //disable
          // this.disable_btns[1] = false; //enable next
          // this.u_action_btns[2] = false; //enable next action btn
          // this.show_u_spinner = false;
          // this.showUplStatusMsg(resp.status);
          setTimeout(() => {
            //this._u_value = 100;
            this.u_action_btns[1] = true; //disable
            this.disable_btns[1] = false; //enable next
            this.u_action_btns[2] = false; //enable next action btn
            this.show_u_spinner = false;
            this.showUplStatusMsg(resp.status);
          }, 2000);
        }
      });
    }
  }

  insertJsonToDB() {
    this.show_u_spinner = true;
    this._u_value = 0;
    this.productService.insertJsonToDB().subscribe((resp: any) => {
      console.log(JSON.stringify(resp));
      //{"status":"success","msg":"New data inserted to DB successfully"}
      if (resp && resp.status === 'success') {
        // this.disable_btns[2] = false; //enable next btn
        // this.show_u_spinner = false;
        this._u_value = 100;
        // this.u_action_btns[2] = true; //disable insert btn
        setTimeout(() => {
          this.disable_btns[2] = false; //enable next btn
          this.show_u_spinner = false;
          //this._u_value = 100;
          this.u_action_btns[2] = true; //disable insert btn
        }, 2000);
      } else {
        console.error('Error! in insertJsonToDB: ', resp);
        this.show_u_spinner = false;
        this._u_value = 100;
      }
      this.showUplStatusMsg(resp.status);
    });
  }

  displaySnackbar(msg: string) {
    //console.log(resp);
    if (msg) {
      this._snackBar.open(msg, "OK", {
        duration: 3000,
        panelClass: ['tw_snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  showSpinner(): boolean {
    return this.show_u_spinner || this.show_d_spinner;
  }

  // disableNextBtn(): boolean{
  //   return this.disable_btns[0] || this.disable_btns[1] || this.disable_btns[2];
  // }

  noCursor() {
    let up_btn = this._elementRef.nativeElement.querySelector(`#up_btn`);
    up_btn.style.cursor = 'not-allowed';
  }

  yesCursor() {
    let up_btn = this._elementRef.nativeElement.querySelector(`#up_btn`);
    up_btn.style.cursor = 'pointer';
  }

  clearFileInput() {
    let file_in = this._elementRef.nativeElement.querySelector(`#file_in`);
    file_in.value = '';
  }

  next() {
    if (this.formStepsNum < 3) {
      this.formStepsNum++;
      this.updateFormSteps();
      this.updateProgressbar();
      this.updateTick();
      //
      //this.showUplStatusMsg();
      this.clearUplStatusMsg();
    }

    // if(this.formStepsNum == 3){
    //   const up_completed_div = this._elementRef.nativeElement.querySelector(".up_completed");
    //   up_completed_div.style.visibility = 'visible';
    // }
  }

  updateFormSteps() {
    const formSteps = this._elementRef.nativeElement.querySelectorAll(".form-step");
    formSteps.forEach((formStep: any) => {
      formStep.classList.contains("form-step-active") &&
        formStep.classList.remove("form-step-active");
    });
    console.log('formStepsNum: ', this.formStepsNum);
    formSteps[this.formStepsNum] &&
      formSteps[this.formStepsNum].classList.add("form-step-active");
  }

  updateProgressbar() {
    const progressSteps = this._elementRef.nativeElement.querySelectorAll(".progress-step");
    progressSteps.forEach((progressStep: any, idx: number) => {
      if (idx < this.formStepsNum + 1) {
        progressStep.classList.add("progress-step-active");
      } else {
        progressStep.classList.remove("progress-step-active");
      }
    });

    console.log("formStepsNum: ", this.formStepsNum);
    const progressActive = this._elementRef.nativeElement.querySelectorAll(".progress-step-active");
    const progress = this._elementRef.nativeElement.querySelector(".progress");
    progress.style.width =
      ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
  }

  updateTick() {
    const tickSteps = this._elementRef.nativeElement.querySelectorAll(".tick-step");
    if (tickSteps[this.formStepsNum - 1]) {
      console.log(tickSteps[this.formStepsNum - 1]);
      tickSteps[this.formStepsNum - 1].style.color = "green";
    }
  }

  showUplStatusMsg(status: string) {
    const up_completed_div = this._elementRef.nativeElement.querySelector(".up_completed");
    up_completed_div.style.visibility = 'visible';
    if (this.formStepsNum == 0) {
      up_completed_div.innerHTML = 'Excel file uploaded, click on Next';
    } else if (this.formStepsNum == 1) {
      up_completed_div.innerHTML = 'Excel converted to DB format, click on Next';
    } else if (this.formStepsNum == 2) {
      let msg = status === 'success' ? 'Excel inserted to database, click on Next' :
        'Excel data is not correct, click on Next';
      up_completed_div.innerHTML = msg;
    } else {
      up_completed_div.innerHTML = "";
    }
  }

  clearUplStatusMsg() {
    const up_completed_div = this._elementRef.nativeElement.querySelector(".up_completed");
    up_completed_div.style.visibility = 'visible';
    up_completed_div.innerHTML = "";

    if (this.formStepsNum == 3) {
      const go_home_div = this._elementRef.nativeElement.querySelector(".go_home");
      go_home_div.style.visibility = 'visible';
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }


}
