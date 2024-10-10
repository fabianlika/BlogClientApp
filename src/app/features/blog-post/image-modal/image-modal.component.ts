import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-image-modal',
  templateUrl: './image-modal.component.html',
  styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {
  @Input() isOpen: boolean = false;
  @Input() selectedImage: string = '';

  close() {
    this.isOpen = false;
  }
}
