import { Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { NavigationService } from '../../../shared/services/navigation.service';
import { Entry } from '../../store/entry.model';
import * as fromLibrary from '../../store/index';
import * as LibraryActions from '../../store/library.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { ElectronService } from 'ngx-electron';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { LibraryService } from '../../../shared/services/library.service';

@Component({
	selector: 'app-search-results',
	templateUrl: './search-results.component.html',
	styleUrls: ['./search-results.component.css'],
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
export class SearchResultsComponent implements OnInit, OnDestroy {

	routerState: RouterStateSnapshot;
	entries$: Observable<Entry[]>;
	config$;
	config
	closeResult;
	modalRef: NgbModalRef;
	selectedEntryId: string;
	subs: Subscription;
	entriesSub: Subscription;
	selected = [];
	searchTerms;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private navigationService: NavigationService,
		private zone: NgZone,
		private libraryService: LibraryService,
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		private electronService: ElectronService,
		private sanitizer: DomSanitizer,
		private route: ActivatedRoute,
		private router: Router) {
			this.routerState = router.routerState.snapshot;
	}

	ngOnInit() {

		this.entries$ = this.store.pipe(select(fromLibrary.getSearchResults),
			map((data: Array<Entry>) => {
				console.log('searchResults :: Resorting entries');
				data.sort((a, b) => {
					if (a.title == null) { return -1; }
					if (a.title === b.title) {
						return a.id < b.id ? -1 : 1
					}
					return a.title < b.title ? -1 : 1;
				});
				return data;
			})
		);

		this.subs = this.store.pipe(select(fromLibrary.getConfig),
			map(config => this.config = config)).subscribe();

		this.subs = this.store.pipe(select(fromLibrary.getSearchTerms))
			.subscribe(searchTerms => {
				this.searchTerms = searchTerms.replace(':', ': ');
			});

		this.subs = this.store.pipe(select(fromLibrary.getSelectedEntryId))
			.subscribe((id: string) => {
				console.log('selectedId:', id);
				this.selectedEntryId = id;
				return id;
			});

		this.cdRef.detectChanges();
	}

	close() {
		this.navigationService.closeSearchResults();
	}

	play(event: Event, file: string) {
		event.preventDefault();
		event.stopPropagation();
		console.log('searchResults :: playing:', file);
		this.electronService.ipcRenderer.send('play-video', file);
	}

	closeDeleteModal(reason) {
		console.log('searchResults :: closeModal :: reason:', reason);
		if (reason === 'delete') {
			console.log('searchResults :: closeModal :: trashing');
			this.trash();
		}
		this.modalRef.dismiss('close');
	}

	ngOnDestroy() {
		if (this.subs) {
			this.subs.unsubscribe();
		}
	}

	showDeleteConfirmation(event, content) {
		event.preventDefault();
		event.stopPropagation();
		this.modalRef = this.modalService.open(content);
		this.modalRef.result.then((result) => {
			this.closeResult = `Closed with: ${result}`;
			console.log(this.closeResult);
		}, (reason) => {
			this.closeResult = `Dismissed with: ${this.getDismissReason(reason)}`;
			console.log(this.closeResult);
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

	edit(event) {
		event.preventDefault();
		event.stopPropagation();
		console.debug(`entry-list.edit() - selectedEntryId: ${this.selectedEntryId}`);
		this.navigationService.setEditEntryParent(this.routerState.url);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}

	trackById(index, item) {
		return item.id;
	}

	trash() {
		console.debug('searchResult :: trash :: this.selectedEntryId:', this.selectedEntryId);
		this.store.dispatch(new LibraryActions.RemoveEntry({ id: this.selectedEntryId }));
	}

	undecorate(entryBox: HTMLDivElement) {
		const poster = entryBox.querySelector('.entry-poster') as HTMLImageElement;
		const entryActions = entryBox.querySelector('.entry-actions') as HTMLDivElement;
		poster ? poster.style['opacity'] = '1.0': {};
		entryActions.style['display'] = 'none';
	}

	decorate(entryBox: HTMLDivElement) {
		const poster = entryBox.querySelector('.entry-poster') as HTMLImageElement;
		const entryActions = entryBox.querySelector('.entry-actions') as HTMLDivElement;
		poster ? poster.style['opacity'] = '0.2' : {};
		entryActions.style['display'] = 'flex';
	}

	toggleActions(event: Event, entry: any) {
		event.preventDefault();
		this.libraryService.touch(event, entry);
		const entryBox = event.currentTarget as HTMLDivElement;
		const selectedIndex = this.selected.indexOf(entryBox);
		if (selectedIndex > -1) {
			this.selected.splice(selectedIndex, 1);
			this.undecorate(entryBox);
			console.debug(`toggleActions :: DeselectEntry selectedIndex: ${selectedIndex}`);
			this.store.dispatch(new LibraryActions.DeselectEntry());
		} else {
			// number or string?
			this.selected.forEach(e => this.undecorate(e));
			this.selected = [entryBox];
			this.decorate(entryBox);
			console.debug(`toggleActions :: SelectEntry id:${entry.id}`);
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
			return '';
		}
	}
/* 
	entryClicked(id: number) {
		this.store.dispatch(new LibraryActions.SelectEntry({ id: id }));
	} */

/* 	closeActions() {
		this.store.dispatch(new LibraryActions.DeselectEntry());
	} */

/* 	addEntry() {
		const currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		this.navigationService.setViewEntryParent(currentLocation);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	} */
}
