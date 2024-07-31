import { QueryList, Renderer2 } from "@angular/core";
import { GridItemComponent } from "./grid-item/grid-item.component";

export class WithGridListItems {
    changesDetected: boolean = false;
    gridItems: QueryList<GridItemComponent>;
    constructor(private renderer: Renderer2) { }

    focusGridListItem(itemId: number) {
        this.gridItems.forEach(child => {
            const button = child.elementRef.nativeElement.querySelector('.grid_item');
            if (child.id === itemId) {
                this.renderer.setStyle(button, 'transform', 'scale(1.1)');
                this.renderer.setStyle(button, 'box-shadow', 'rgba(255, 255, 255, 0.471) 0px -50px 36px -28px inset');
            } else {
                this.renderer.setStyle(button, 'transform', 'scale(1.0)');
                this.renderer.setStyle(button, 'box-shadow', 'none');
            }
        })


    }

    subscribeChanges() {
        this.gridItems.changes.subscribe((gridItems: QueryList<GridItemComponent>) => {
            this.changesDetected = true;
        })
    }

}

