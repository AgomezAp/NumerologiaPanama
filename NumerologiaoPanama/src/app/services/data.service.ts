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
  private paymentDataKey = 'paymentData';
  private encryptionKey = 'U0qQ0TGufDDJqCNvQS0b795q8EZPAp9E';

  setPaymentData(data: any): void {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
    localStorage.setItem(this.paymentDataKey, encryptedData);
  }

  getPaymentData(): any {
    const encryptedData = localStorage.getItem(this.paymentDataKey);
    if (encryptedData) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      } catch (e) {
        console.error('Error al desencriptar los datos:', e);
        return null;
      }
    }
    return null;
  }

  clearPaymentData(): void {
    localStorage.removeItem(this.paymentDataKey);
  }
}
