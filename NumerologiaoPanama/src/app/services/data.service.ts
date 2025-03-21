import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor() { }
  private formData: any = {};

  setFormData(data: any): void {
    this.formData = { ...this.formData, ...data };
  }

  getFormData(): any {
    return this.formData;
  }
}