import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  template: `
<div>
  <div class="modal-header"  style="padding:12px;">
    <h3 style="margin:0px;" class="modal-title">{{title}}</h3>
  </div>
  <div class="modal-body">
    <p>{{prompt}}</p>
  </div>
  <div class="modal-footer">
    <button type="button"
      class="btn btn-outline-dark cancel"
      (click)="activeModal.close(false)">NO</button>
    <button type="button"
      class="btn btn-outline-dark"
      (click)="activeModal.close(true)">YES</button>
  </div>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  title: string;
  prompt: string;

  constructor(public activeModal: NgbActiveModal) {
  }
}
