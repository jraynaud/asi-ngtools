import { DefaultControlValueAccessor } from './../common/default-control-value-accessor';
import { Component, Input, forwardRef, HostBinding, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'asi-switch',
  templateUrl: 'asi-switch.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiSwitchComponent),
      multi: true
    }
  ]
})
export class AsiSwitchComponent extends DefaultControlValueAccessor implements OnInit {

  @HostBinding('class') class = 'asi-component asi-switch';

  @Input() label: string;
  @Input() disabled = false;
  @Input() labelPosition: 'top' | 'left' | 'right' | 'bottom' | 'bottom-center' | 'top-center' = 'top';

  constructor() {
    super();
  }

  ngOnInit() {
    this.class += ' label-' + this.labelPosition;
  }

  switch() {
    this.value = !this.value;
  }
}