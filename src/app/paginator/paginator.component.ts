import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() cangoback = false;
  @Input() cangoforward = false;
  @Input() numberOfPages = 0;
  @Input() showLast = false;
  @Output() goForward: EventEmitter<string> = new EventEmitter();
  @Output() goBack: EventEmitter<string> = new EventEmitter();
  @Output() goToPage: EventEmitter<string> = new EventEmitter();

  pageArray: number[] = [];
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // tslint:disable-next-line: no-string-literal
    if (changes['numberOfPages']) {
      this.pageArray = [];
      if (this.numberOfPages < 5) {
        for (let i = 1; i <= this.numberOfPages; i++) {
          this.pageArray.push(i);
        }
      } else if (this.numberOfPages < 25) {
        for (let i = 1; i < 5; i++) {
          this.pageArray.push(i);
        }
        for (let i = 5; i <= this.numberOfPages; i += 5) {
          this.pageArray.push(i);
        }
      }
    }
  }

  onGotoPage($event): void {

    this.goToPage.emit($event);
  }

  onNext($event): void {
    this.goForward.emit('go forward');
  }

  onPrevious($event): void {
    this.goBack.emit('go back');
  }
}
