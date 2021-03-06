import { ChangeDetectorRef, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, Pipe, PipeTransform } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../../../x-shared/app/shared';
import { Role, RoleService } from '../../../x-shared/app/roles';

@Component({
    selector: 'role-list',
    templateUrl: './role-list.component.html',
    styleUrls: ['./role-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {
    @Input() showSelection: boolean;
    @Output() loaded = new EventEmitter();

    constructor(private _store: RoleService,
        private _router: Router) { }

    ngOnInit() {
        this._store.load()
            .then(
            () => this.loaded.emit('loaded'),
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while loading items.');
                this.loaded.emit('loaded');
            }
            );
    }

    imageSource(role: Role) {
        if (role.deleted) {
            return role.selected ? 'icon-radio-checked2' : 'icon-radio-unchecked'
        }
        return role.selected ? 'icon-checkbox-checked' : 'icon-checkbox-unchecked';
    }

    toggleSelection(role: Role) {
        role.selected = !role.selected;
        return;
    }

    delete(role: Role) {
        if (confirm('Confirm deletion of role "' + role.name + '" ?')) {
            role.deleting = true;

            this._store.delete(role)
                .then(
                () => { role.deleting = false; role.deleted = true; },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while deleting an item.');
                }
                );
        }
    }

    edit(role: Role) {
        this._router.navigate(['/role', role.id]);
    }
}
