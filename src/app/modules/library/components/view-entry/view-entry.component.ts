import { Component, OnInit, NgZone, ViewChildren, QueryList, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import "rxjs/add/operator/publishReplay";
import { Observable } from 'rxjs/Observable';
import { NavigationService } from '../../../shared/services/navigation.service';
import * as fromLibrary from '../../store';
import * as LibraryAction from '../../store/library.actions';
import { Entry } from '../../store/entry.model';

import * as jQuery from 'jquery';
import * as _ from 'lodash';
require('jqueryui');

import "../../../../../assets/scripts/gridstack.all";

// todo: guard to ensure selected entry or route to /library

@Component({
	selector: 'app-view-entry',
	templateUrl: './view-entry.component.html',
	styleUrls: ['./view-entry.component.css']
})
export class ViewEntryComponent implements OnInit, AfterViewInit {

	entry$: Observable<Entry>;
	entry: Entry;
	serializedData: any;
	grid: any;
	
	constructor(private store: Store<fromLibrary.LibraryState>,
		private router: Router,
		private zone: NgZone,
		private cdRef: ChangeDetectorRef,
		private navigationService: NavigationService) { }

	ngAfterViewInit() {
		jQuery('.grid-stack').gridstack({
			cellHeight: 80,
			verticalMargin: 0,
			draggable: true,
			resizable: {
        handles: 'e, se, s, sw, w'
    	}
		});

		/*
		this.serializedData = [
			{x: 5, y: 0, width: 7, height: 1},
			{x: 5, y: 0, width: 7, height: 1},
			{x: 5, y: 0, width: 7, height: 1},
			{x: 5, y: 0, width: 7, height: 1},
			{x: 5, y: 0, width: 7, height: 1},
			{x: 5, y: 0, width: 7, height: 1},
			{x: 5, y: 0, width: 7, height: 1},
			{x: 5, y: 0, width: 7, height: 1},
			{x: 5, y: 0, width: 7, height: 1},
			{x: 0, y: 0, width: 5, height: 5}
		];

		const items = GridStackUI.Utils.sort(this.serializedData);

		$('.grid-stack').data('gridstack').removeAll();

		_.each(items, function (node) {
			$('.grid-stack').data('gridstack').addWidget(
				$('<div><div class="grid-stack-item-content" /><div/>'),
				node.x, node.y, node.width, node.height
			);
		});
		*/

		$('.grid-stack-item').on('dragstop, resizestop', this.onGridChange);

		this.zone.run(() => this.cdRef.detectChanges());
	}

	onGridChange(event, ui) {
		this.serializedData = _.map($('.grid-stack > .grid-stack-item:visible'), function (el) {
			el = jQuery(el);
			return {
				x: el.data('gs-x'),
				y: el.data('gs-y'),
				width: el.data('gs-width'),
				height: el.data('gs-height')
			};
		}, this);

		console.log(JSON.stringify(this.serializedData));
		
		// todo: save dimensions and position against Entry
	}

	ngOnInit() {
		console.debug('ViewEntryComponent Init');
		this.entry$ = this.store.pipe(select(fromLibrary.getSelectedEntry));
		this.entry$.subscribe(entry => this.entry = entry);
	}

	edit() {
		this.zone.run(() => this.router.navigate(['/library/edit']));
	}

	close() {
		this.navigationService.closeViewEntry();
	}

	trash(id: string) {
		console.debug(`trash(id): ${id}`);
		this.store.dispatch(new LibraryAction.RemoveEntry({id: id}))
	}

	searchMetadataProvider(title) {
		console.debug('searchMetadataProvider() entry');
		console.debug(`searchMetadataProvider() searching metadata providers with terms ${title}`);
		this.store.dispatch(new LibraryAction.SearchForMetadata({keywords: title}));
	}
}
