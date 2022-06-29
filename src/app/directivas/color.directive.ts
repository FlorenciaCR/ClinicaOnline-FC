import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appColor]'
})
export class ColorDirective {

  constructor(private el: ElementRef) { 
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.cambiarColor('#8460c4')
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.cambiarColor('gray');
  }

  cambiarColor(color : string){
    this.el.nativeElement.style.backgroundColor = color;
  }
}
