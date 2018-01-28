import { DefaultControlValueAccessor } from './../common/default-control-value-accessor';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { Component, forwardRef, Input, Output, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';

import * as lodash from 'lodash';

@Component({
  selector: 'asi-icon-input',
  templateUrl: 'asi-icon-input.component.html',
  host: { 'class': 'asi-component asi-icon-input' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiIconInputComponent),
      multi: true
    }
  ]
})
export class AsiIconInputComponent extends DefaultControlValueAccessor {

  @Input() label: string;
  @Input() placeholder: string = "";
  @Input() labelPosition: 'top' | 'left' | 'right' | 'bottom' | 'bottom-center' | 'top-center' = "top";

  @Input() icon: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

  @Input() pattern: RegExp;

  @Input() maxlength = -1;

  @Input() number = false;

  @Input() type: 'password' | 'text' = 'text';

  @Output('iconClicked')
  public iconClicked: EventEmitter<any>= new EventEmitter<any>();

  inputControl = new FormControl();

  @ViewChild("input") inputElm: ElementRef;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    this.renderer.addClass(this.elementRef.nativeElement, "label-" + this.labelPosition);
    if (this.number == true) {
      this.pattern = new RegExp("^-*[0-9,\.]*$");
    }
  }

  ngAfterViewInit() {
    this.inputControl.valueChanges.subscribe((value: string) => {
      if (value == "") {
        this.value = null;
      } else if (this.isValide(value)) {
        this.value = value;
      } else if (this.maxlength != -1 && value.length > this.maxlength) {
        //if value is too long, we truncate
        this.value = value.substr(0, this.maxlength);
      }
      this.inputElm.nativeElement.value = this._value;
    });
  }

  private isValide(value: string): boolean {
    return value == null || ((this.maxlength == -1 || value.length <= this.maxlength)
      && (this.pattern == null || this.pattern.test(value)))
  }

  writeValue(value: string) {
    if (this.isValide(value)) {
      this.inputControl.setValue(value, { emitEvent: false });
    } else if (this.maxlength != -1 && value.length > this.maxlength) {
      //Length incorrect on truncate
      this.inputControl.setValue(lodash.truncate(value, { length: this.maxlength }), { emitEvent: false });
    } else {
      //Pattern incorrect
      this.inputElm.nativeElement.value = "Incorrect value";
    }
  }

  public handleIconClick(){
    this.iconClicked.emit();
  }
}