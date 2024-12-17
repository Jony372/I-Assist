import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalInterface } from 'flowbite';
import { NgxScannerQrcodeModule, ScannerQRCodeConfig, ScannerQRCodeResult }
  from 'ngx-scanner-qrcode';
@Component({
  selector: 'app-qr-reader-modal',
  standalone: true,
  imports: [NgxScannerQrcodeModule, FormsModule],
  templateUrl: './qr-reader-modal.component.html',
  styleUrl: './qr-reader-modal.component.css'
})
export class QrReaderModalComponent {
  @Input() modal!: ModalInterface;
  @Output() readed = new EventEmitter<string>;
  read = false;
  counter = 0;
  code = '';

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth
      },
    },
  };

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();
    if (!this.read) {
      const value = e[0].value;
      this.read = true;
      this.readed.emit(value);
    }
    this.counter++;
    //contador de 3 segundos para volver a leer
    setTimeout(() => {
      this.read = false;
    }, 3000);
    
  }

  joinClass(){
    this.readed.emit(this.code);
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => null, alert);
      setTimeout(() => {
        this.counter = 3;
      }, 10000);
    } else {
      action[fn]().subscribe((r: any) => null, alert);
    }
  }
}
