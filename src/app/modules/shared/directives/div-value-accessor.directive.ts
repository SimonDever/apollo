import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Directive, forwardRef, Renderer, ElementRef } from '@angular/core';

const DIV_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => DivValueAccessorDirective),
	multi: true
};

@Directive({
	selector: 'div[formControlName]',
	host: {
			'(input)': 'onChange($event.target)',
			'(blur)' : 'onTouched()'
	},
	providers: [DIV_VALUE_ACCESSOR]
})
export class DivValueAccessorDirective implements ControlValueAccessor {
	onChange = (_) => {};
	onTouched = () => {};

	constructor(
			private _renderer: Renderer,
			private _elementRef: ElementRef
	) {}

	public writeValue(value: string): void {
		let normalizedValue = String(value);
		/* if (normalizedValue) {
			normalizedValue = normalizedValue.replace(/^s|s$/g, ' ');
		} */

		this._renderer.setElementProperty(
			this._elementRef.nativeElement, 'innerHTML', normalizedValue);
	}

	public registerOnChange(fn: (_: any) => void): void {
			this.onChange = (target: any) => {
					fn(target.innerText);
			};
	}

	public registerOnTouched(fn: () => void): void {
			this.onTouched = fn;
	}
}
