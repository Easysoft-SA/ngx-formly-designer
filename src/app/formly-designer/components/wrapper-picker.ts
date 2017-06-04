import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig } from 'ng-formly';
import { FormlyDesignerConfig } from '../formly-designer-config';
import { cloneDeep } from 'lodash';


declare var $: any;

@Component({
    selector: 'wrapper-picker',
    template: `
        <form novalidate [formGroup]="form">
            <div class="form-group">
                <div class="input-group">
                    <wrapper-select formControlName="wrapper">
                    </wrapper-select>
                    <button type="button" class="btn btn-secondary" [disabled]="form.invalid" (click)="add()">
                        Add
                    </button>
                </div>
            </div>
            <div #modal class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add {{ wrapper }}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <wrapper-editor #editor [formControl]="fieldEdit" [field]="fieldSource" [wrapperIndex]="wrapperIndex">
                            </wrapper-editor>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" (click)="onApply()"
                                [disabled]="editor.invalid">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `,
    styles: [`
        .btn:not(:disabled), .dropdown-item:not(:disabled) {
            cursor: pointer;
        }
        .input-group > .btn {
            border-radius: 0 .25rem .25rem 0;
        }
        .input-group, .modal-header {
            display: flex;
        }
        .modal-header {
            justify-content: space-between;
        }
        wrapper-select {
            flex-grow: 2;
        }
        :host /deep/ wrapper-select > select {
            border-radius: .25rem 0 0 .25rem;
            border-right: 0;
        }
        ::after {
            display: none !important;
        }
    `]
})
export class WrapperPickerComponent implements OnInit {
    @ViewChild('modal') modalRef: ElementRef;
    @Input() field: FormlyFieldConfig;
    @Input() wrapperIndex: number;
    @Output() selected = new EventEmitter<FormlyFieldConfig>();

    constructor(
        private formBuilder: FormBuilder,
        private formlyDesignerConfig: FormlyDesignerConfig
    ) { }

    form: FormGroup;
    fieldSource: FormlyFieldConfig;
    fieldEdit = new FormControl({});

    get wrapper(): string {
        return this.form.get('wrapper').value;
    }

    private get modal(): any {
        return $(this.modalRef.nativeElement);
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            wrapper: ['', Validators.compose([Validators.required, Validators.pattern(/^\s*\S.*$/)])]
        });
    }

    add(): void {
        this.fieldEdit.setValue({});
        this.modal.modal('show');
        const fieldSource = cloneDeep(this.field);
        fieldSource.wrappers.push(this.wrapper);
        this.fieldSource = fieldSource;
    }

    onApply(): void {
        this.selected.emit(this.fieldEdit.value);
        this.modal.modal('hide');
    }
}
