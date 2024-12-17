import { Component, Input } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { ModalInterface } from 'flowbite';

@Component({
  selector: 'app-qr-generator-modal',
  standalone: true,
  imports: [QRCodeModule],
  templateUrl: './qr-generator-modal.component.html',
  styleUrl: './qr-generator-modal.component.css'
})
export class QrGeneratorModalComponent {
  @Input() modal!: ModalInterface;
  @Input() code: string = "";
  @Input() tittle: boolean = true;
}
