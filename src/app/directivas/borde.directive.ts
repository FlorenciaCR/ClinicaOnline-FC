import { Directive, ElementRef, HostListener,Renderer2 } from '@angular/core';

@Directive({
  selector: '[appBorde]'
})
export class BordeDirective {

  constructor(private el : ElementRef, private re : Renderer2) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.re.setStyle(this.el.nativeElement,'border-width','3px'); 
  }

  @HostListener('mouseleave') onMouseExit() {
    this.re.setStyle(this.el.nativeElement,'border-width','1px');   
  }

}
