import { Component, OnInit, NgZone, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable ,  Subscription } from 'rxjs';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import { Entry } from '../../store/entry.model';
import * as LibraryActions from '../../store/library.actions';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-entry-list',
	templateUrl: './entry-list.component.html',
	styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit, OnDestroy {

	routerState: RouterStateSnapshot;
	entries$: Observable<Entry[]>;
	needEntries$: Observable<boolean>;
	closeResult;
	modalRef: NgbModalRef;
	selectedEntryId: string;
	subs: Subscription;
	entriesSub: Subscription;

	constructor(private store: Store<fromLibrary.LibraryState>,
		private navigationService: NavigationService,
		private zone: NgZone,
		private cdRef: ChangeDetectorRef,
		private modalService: NgbModal,
		private sanitizer: DomSanitizer,
		private router: Router) {
			this.routerState = router.routerState.snapshot;
	}

	ngOnInit() {
		console.log('EntryListComponent Init');
		this.entries$ = this.store.pipe(select(fromLibrary.getAllEntries));
		this.needEntries$ = this.store.pipe(select(fromLibrary.getNeedEntries));
		this.subs = this.needEntries$.subscribe(needEntries => {
			if (needEntries) {
				this.store.dispatch(new LibraryActions.Load());
			}
		});
		this.subs.add(this.store.pipe(select(fromLibrary.getSelectedEntryId))
			.subscribe((id: string) => {
				console.log('selectedId:', id);
				return this.selectedEntryId = id;
			}));

		this.cdRef.detectChanges();
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
			return	`with: ${reason}`;
		}
	}

	edit() {
		console.debug(`entry-list.edit() - selectedEntryId: ${this.selectedEntryId}`);
		this.navigationService.setEditEntryParent(this.routerState.url);
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}

	trash() {
		console.log('entry-list.trash() - selectedEntryId:', this.selectedEntryId);
		this.store.dispatch(new LibraryActions.RemoveEntry({id: this.selectedEntryId}));
	}

	toggleActions(entry: any) {
		if (!this.modalService.hasOpenModals()) {
			if (this.selectedEntryId === entry.id) {
				console.log('closing actions');
				this.closeActions();
			} else {
				console.log('showing actions');
				this.entryClicked(entry.id);
			}
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
