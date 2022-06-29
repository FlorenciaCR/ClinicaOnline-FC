import { Directive, ElementRef, HostListener,Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAgrandar]'
})
export class AgrandarDirective {

  constructor(private el : ElementRef,private re : Renderer2) { }
  @HostListener('mouseenter') onMouseEnter() {
    this.re.setStyle(this.el.nativeElement,'transform','scale(1.05,1.05)'); 
  }

  @HostListener('mouseleave') onMouseExit() {
    this.re.setStyle(this.el.nativeElement,'transform','scale(1,1)');   
  }


}
