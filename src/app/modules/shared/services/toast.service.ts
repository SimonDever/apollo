import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts: any[] = [];

  show(textOrTemplate: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTemplate, ...options });
  }
  
  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  showStandard(message: string, options) {
    this.show(message, { ...options });
  }

  showSuccess(message: string, options) {
    this.show(message, { classname: 'bg-success text-light', ...options });
  }

  showDanger(message: string, options) {
    this.show(message, { classname: 'bg-danger text-light', ...options });
  }
}