import { ElectronService } from 'ngx-electron';
import { Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy, ViewChild, AfterViewInit, SimpleChanges, OnChanges, AfterContentInit, Input, TemplateRef } from '@angular/core';
import { Router, RouterStateSnapshot, ActivatedRoute, NavigationEnd } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import * as LibraryActions from '../../store/library.actions';
import { Entry } from '../../store/entry.model';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';

@Component({
	selector: 'app-entry-list',
	templateUrl: './entry-list.component.html',
	styleUrls: ['./entry-list.component.css'],
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({opacity: 0}),
				animate('.5s ease-out', style({opacity: 1}))
			]),
			transition(':leave', [
				style({opacity: 1}),
				animate('.5s ease-in', style({opacity: 0}))
			])
		])
	]
})
export class EntryListComponent implements OnInit, OnDestroy, AfterViewInit {

	routerState: RouterStateSnapshot;
	entries$: Observable<Entry[]>;
	needEntries$: Observable<boolean>;
	closeResult;
	modalRef: NgbModalRef;
	selectedEntryId: string;
	subs: Subscription;
	entriesSub: Subscription;
	selected = [];
	contentReady: boolean;
	fragment: string;
	selectedEntry: Entry;

	@ViewChild(VirtualScrollerComponent, {static: false})
	private virtualScroller: VirtualScrollerComponent;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private navigationService: NavigationService,
		private zone: NgZone,
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		private sanitizer: DomSanitizer,
		private electronService: ElectronService,
		private route: ActivatedRoute,
		private router: Router) {
			this.routerState = router.routerState.snapshot;
			this.fragment = router.routerState.snapshot.root.fragment;
	}

	ngOnInit() {
		this.contentReady = false;
		this.entries$ = this.store.pipe(
			select(fromLibrary.getAllEntries),
			map((data: Array<Entry>) => {
				data.sort((a, b) => {
					if (a.title == null || b.title == null) { return 1; }
					return a.title < b.title ? -1 : 1;
				});
				this.navigationService.setBookmarks(data);
				return data;
			})
		);

		this.needEntries$ = this.store.pipe(select(fromLibrary.getNeedEntries));
		this.subs = this.needEntries$.subscribe(needEntries => {
			if (needEntries) {
				this.store.dispatch(new LibraryActions.Load());
			}
		});

		this.subs.add(this.store.pipe(select(fromLibrary.getSelectedEntry))
			.subscribe(entry => {
				// console.log('Entry', entry);
				this.selectedEntry = entry;
			}));

		this.subs.add(this.store.pipe(select(fromLibrary.getSelectedEntryId))
			.subscribe((id: string) => {
				// console.log('selectedId:', id);
				this.selectedEntryId = id;
				return id;
			}));

		this.cdRef.detectChanges();
	}

	ngAfterViewInit() {
		this.subs.add(this.navigationService.bookmark$.pipe(map((char: string) => {
			this.virtualScroller.scrollInto(this.navigationService.getBookmark(char));
		})).subscribe());

		this.scrollToSelectedEntry();
	}

	scrollToSelectedEntry(): void {
		if (this.selectedEntryId != null) {
			// console.log(`scrollTo - about to scroll to selectedEntryId ${this.selectedEntryId}`);
			// TODO: Don't call if entry is already fully visible to prevent animation trigger
			this.virtualScroller.scrollInto(this.selectedEntry);
		}
	}

	closeModal(reason) {
		console.log('closeModal:: reason:', reason);
		if (reason === 'ok') {
			this.trash();
		}
		this.modalRef.dismiss('close');
	}

	ngOnDestroy() {
		if (this.subs) {
			this.subs.unsubscribe();
		}
	}

	showDeleteConfirmation(event: Event, content: TemplateRef<any>) {
    event.stopPropagation();
		this.modalRef = this.modalService.open(content);
		this.modalRef.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
			// console.log(this.closeResult);
		}, (reason) => {
			this.closeResult = `Dismissed with: ${this.getDismissReason(reason)}`;
			// console.log(this.closeResult);
		});
	}

	getDismissReason(reason: any): string {
		if (reason === ModalDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on a backdrop';
		} else if (reason === 'close') {
			return 'by pressing x on the modal';
		} else {
			return `with: ${reason}`;
		}
	}

	edit(event: Event) {
		event.stopPropagation();
		// console.log(`entry-list.edit() - selectedEntryId: ${this.selectedEntryId}`);
		this.navigationService.setEditEntryParent(this.routerState.url);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}

	play(event: Event, file: string) {
		event.stopPropagation();
		// console.log('file:', file);
		this.electronService.ipcRenderer.send('play-video', file);
	}

	trackById(index, item) {
		return item.id;
	}

	trash() {
		// console.log('entry-list.trash() - selectedEntryId:', this.selectedEntryId);
		this.store.dispatch(new LibraryActions.RemoveEntry({ id: this.selectedEntryId }));
	}

	undecorate(entryBox: HTMLDivElement) {
		const poster = entryBox.querySelector('.entry-poster') as HTMLImageElement;
		const entryActions = entryBox.querySelector('.entry-actions') as HTMLDivElement;
		entryBox.style['backgroundColor'] = 'transparent';
		poster ? poster.style['opacity'] = '1.0' : {};
		entryActions.style['opacity'] = '0';
	}

	decorate(entryBox: HTMLDivElement) {
		const poster = entryBox.querySelector('.entry-poster') as HTMLImageElement;
		const entryActions = entryBox.querySelector('.entry-actions') as HTMLDivElement;
		entryBox.style['backgroundColor'] = '#333';
		poster ? poster.style['opacity'] = '0.2' : {};
		entryActions.style['opacity'] = '1';
	}

	toggleActions(event: Event, entry: any) {
		event.preventDefault();
		const entryBox = event.currentTarget as HTMLDivElement;
		const selectedIndex = this.selected.indexOf(entryBox);
		if (selectedIndex > -1) {
			this.selected.splice(selectedIndex, 1);
			this.undecorate(entryBox);
			this.store.dispatch(new LibraryActions.DeselectEntry());
		} else {
			this.selected.forEach(e => this.undecorate(e));
			this.selected = [entryBox];
			this.decorate(entryBox);
			this.store.dispatch(new LibraryActions.SelectEntry({ id: entry.id }));
		}
	}

	posterUrl(path: string) {
		if (path) {
			if (path.toLowerCase().startsWith('c:\\')) {
				return this.sanitizer.bypassSecurityTrustResourceUrl('file://' + path);
			} else if (path.startsWith('data:image')) {
				return path;
			}
		} else {
			console.error('Using remote image', path);
			//return '';
			return path;
		}
	}

	entryClicked(id: number) {
		this.store.dispatch(new LibraryActions.SelectEntry({ id: id }));
	}

	closeActions() {
		this.store.dispatch(new LibraryActions.DeselectEntry());
	}

	/* addEntry() {
		const currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		this.navigationService.setViewEntryParent(currentLocation);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	} */
}
