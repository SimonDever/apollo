import { Directive, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Subscription, fromEvent } from 'rxjs';

@Directive({ selector:
  `input[type=text],
   input[type=search],
   textarea,
   div[contenteditable]`
})
export class ContextMenuDirective implements OnInit, OnDestroy {

  private subs: Subscription;

  constructor(private elementRef: ElementRef,
    private electronService: ElectronService)
  { }

  ngOnInit() {
    const menu = this.buildMenu();
    this.subs = fromEvent(this.elementRef.nativeElement, 'contextmenu')
      .subscribe((e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        let node: HTMLElement = e.target as HTMLElement;
        while (node) {
          if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
            menu.popup({ window: this.electronService.remote.getCurrentWindow() });
            break;
          }
          node = node.parentNode as HTMLElement;
        }
      });
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private buildMenu() {
    const menu = new this.electronService.remote.Menu();
    const MenuItem = this.electronService.remote.MenuItem;
    menu.append(new MenuItem({ role: 'undo' }));
    menu.append(new MenuItem({ role: 'redo' }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ role: 'cut' }));
    menu.append(new MenuItem({ role: 'copy' }));
    menu.append(new MenuItem({ role: 'paste' }));
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ role: 'selectAll' }));
    return menu;
  }
}