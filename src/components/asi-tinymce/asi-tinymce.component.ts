import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DefaultControlValueAccessor } from './../common/default-control-value-accessor';
import { Component, Input, forwardRef, NgZone, ElementRef, Renderer2 } from '@angular/core';

declare var tinymce: any;

@Component({
  selector: 'asi-tinymce',
  templateUrl: 'asi-tinymce.component.html',
  host: { 'class': 'asi-component asi-tinymce' },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AsiTinyMCE),
      multi: true
    }
  ]
})
export class AsiTinyMCE extends DefaultControlValueAccessor {

  @Input() label: string;
  @Input() labelPosition: 'top' | 'left' | 'right' | 'bottom' | 'bottom-center' | 'top-center' = "top";
  @Input() elementId: string;

  //reference de l'instance du tinymce
  editor: any;

  constructor(private zone: NgZone, private elementRef: ElementRef, private renderer: Renderer2) {
    super();
  }

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, "label-" + this.labelPosition);
  }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table', 'textcolor', 'colorpicker'],
      toolbar: " fontselect fontsizeselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent blockquote | forecolor backcolor",
      skin_url: '../assets/tinymce/skin',
      setup: (editor: any) => {
        this.editor = editor;
        editor.on('keyup', () => {
          this.onModelChange();
        });
        editor.on('Change', () => {
          this.onModelChange();
        });
      },
      init_instance_callback: (editor: any) => {
        if (this.value != null) {
          editor.setContent(this.value);
        }
      }
    });
  }

  onModelChange() {
    this.zone.run(() => {
      const content = this.editor.getContent();
      this.value = content;
      this.onValueChange.emit(content);
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

}