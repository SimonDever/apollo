import { Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
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

	closeResult;
	modalRef: NgbModalRef;
	selectedEntryId: string;
	subs: Subscription;
	entriesSub: Subscription;
	selected = [];

	constructor(private store: Store<fromLibrary.LibraryState>,
		private navigationService: NavigationService,
		private zone: NgZone,
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		private sanitizer: DomSanitizer,
		private route: ActivatedRoute,
		private router: Router) {
			this.routerState = router.routerState.snapshot;
	}

	ngOnInit() {

		this.entries$ = this.store.pipe(select(fromLibrary.getSearchResults),
			map((data: Array<Entry>) => {
				const t0 = performance.now();
				data.sort((a, b) => {
					if (a.title == null || b.title == null) { return 1; }
					return a.title < b.title ? -1 : 1;
				});
				const t1 = performance.now();
				console.log('Sorting took ' + (t1 - t0) + ' milliseconds.');
				return data;
			})
		);

		this.subs = this.store.pipe(select(fromLibrary.getSelectedEntryId))
			.subscribe((id: string) => {
				console.log('selectedId:', id);
				this.selectedEntryId = id;
				return id;
			});

		this.cdRef.detectChanges();
		this.entries$ = this.store.pipe(select(fromLibrary.getSearchResults));
	}

	close() {
		this.navigationService.closeSearchResults();
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

	showDeleteConfirmation(content) {
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

	edit() {
		console.debug(`entry-list.edit() - selectedEntryId: ${this.selectedEntryId}`);
		this.navigationService.setEditEntryParent(this.routerState.url);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}

	trackById(index, item) {
		return item.id;
	}

	trash() {
		console.log('entry-list.trash() - selectedEntryId:', this.selectedEntryId);
		this.store.dispatch(new LibraryActions.RemoveEntry({ id: this.selectedEntryId }));
	}

	undecorate(entryBox: HTMLDivElement) {
		const poster = entryBox.querySelector('.entry-poster') as HTMLImageElement;
		const entryActions = entryBox.querySelector('.entry-actions') as HTMLDivElement;
		entryBox.style['backgroundColor'] = 'transparent';
		poster ? poster.style['opacity'] = '1.0': {};
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
			// number or string?
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
			return '';
		}
	}

	entryClicked(id: number) {
		this.store.dispatch(new LibraryActions.SelectEntry({ id: id }));
	}

	closeActions() {
		this.store.dispatch(new LibraryActions.DeselectEntry());
	}

	addEntry() {
		const currentLocation = this.routerState.url;
		this.navigationService.setAddEntryParent(currentLocation);
		this.navigationService.setViewEntryParent(currentLocation);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}
}
