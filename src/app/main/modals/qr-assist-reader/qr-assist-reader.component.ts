import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalInterface } from 'flowbite';
import { NgxScannerQrcodeModule, ScannerQRCodeConfig, ScannerQRCodeResult }
  from 'ngx-scanner-qrcode';
@Component({
  selector: 'app-qr-assist-reader',
  standalone: true,
  imports: [NgxScannerQrcodeModule],
  templateUrl: './qr-assist-reader.component.html',
  styleUrl: './qr-assist-reader.component.css'
})
export class QrAssistReaderComponent {
  @Input() modal!: ModalInterface;
  @Output() readed = new EventEmitter<string>;
  read = false;

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
    //contador de 3 segundos para volver a leer
    setTimeout(() => {
      this.read = false;
    }, 3000);
    
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find(f => (/back|rear|environment/gi.test(f.label))); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    }

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe((r: any) => null, alert);
    } else {
      action[fn]().subscribe((r: any) => null, alert);
    }
  }
}