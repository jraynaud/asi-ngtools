import { Component, Input, forwardRef, Output, EventEmitter, ElementRef, ContentChild, Renderer2, ViewChild } from '@angular/core';

import { DefaultControlValueAccessor } from './../../common/default-control-value-accessor';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';

import { AsiComponentTemplateOptionDef, AsiComponentTemplateSelectedDef } from './../../common/asi-component-template';
import { AsiDropDown } from './../../asi-dropdown/asi-dropdown.component';

/**
 * asi-autocomplete component
 */
@Component({
  selector: 'asi-autocomplete',
  templateUrl: 'asi-autocomplete.component.html',
  host: { 'class': 'asi-component asi-autocomplete' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiAutoCompleteComponent),
      multi: true
    }
  ]
})
export class AsiAutoCompleteComponent extends DefaultControlValueAccessor {

  /** Label to display */
  @Input() label: string;
  /** Label position */
  @Input() labelPosition: 'top' | 'left' | 'right' | 'bottom' | 'bottom-center' | 'top-center' = "top";

  /** Delay between the moment you stop typing and dropdown is display */
  @Input() delay: number = 500;

  /** Data to display in the dropdown : change input reference to make it display */
  @Input() data: Array<any>;

  @Input() placeholder: string = "";

  /** Event emitted to request new data when delay is past */
  @Output() onRequestData = new EventEmitter();

  @ContentChild(AsiComponentTemplateOptionDef) optionDef: AsiComponentTemplateOptionDef;
  @ContentChild(AsiComponentTemplateSelectedDef) selectedDef: AsiComponentTemplateSelectedDef;

  @ViewChild("dropdown") dropdown: AsiDropDown;

  autoCompleteControl = new FormControl();
  open = false;

  //Var used to manage component initialization
  firstRequestDone: Boolean = null;
  init: boolean = false;

  private currentValue: any = null;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, "label-" + this.labelPosition);
    this.autoCompleteControl.valueChanges
      .debounceTime(this.delay)
      .subscribe(value => {
        this.currentValue = value;
        this.onRequestData.emit(value);
        this.firstRequestDone = true;
      });
  }

  onDropdownClose() {
    this.open = false;
  }

  ngOnChanges() {
    if (this.init == true) {
      this.open = true;
    } else {
      if (this.firstRequestDone == true) {
        this.init = true;
      }
    }
  }

  selectValue(data: any) {
    this.value = data;
    this.open = false;
  }

  clearValue() {
    this.value = null;
    this.autoCompleteControl.setValue(this.currentValue, { emitEvent: false });
    setTimeout(() => { this.open = true });
  }

  writeValue(value: any) {
    if (this.init == false) {
      this.autoCompleteControl.setValue(this.currentValue);
    } else {
      this._value = value;
      this.currentValue = value;
      if (this.value == null) {
        this.autoCompleteControl.setValue(this.currentValue, { emitEvent: false });
      }
    }
  }
}