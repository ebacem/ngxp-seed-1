import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Logger } from '../../../x-shared/app/shared';
import { Role, RoleService } from '../../../x-shared/app/roles';

import { RoleDetailsComponent } from './role-details';

@Component({
    selector: 'role-info',
    templateUrl: './role-info.component.html',
    styleUrls: ['./role-info.component.scss']
})
export class RoleInfoComponent implements OnInit {
    role: Role;

    constructor(public store: RoleService,
        private _route: ActivatedRoute,
        private _router: Router,
        private _location: Location) { }

    ngOnInit() {
        this._route.params
            .switchMap((params: Params) => this.store.get(params['id']))
            .subscribe((data: any) => {
                this.role = this.store.newModel(data);
            },
            (error) => {
                if (Logger.isEnabled) {
                    Logger.dir(error);
                }
                alert('An error occurred while loading a role.');
                this._location.back();
            });
    }

    delete(role: Role) {
        if (confirm('Confirm deletion of role "' + role.name + '" ?')) {
            role.deleting = true;

            this.store.delete(role)
                .then(
                () => { },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while deleting a role.');
                }
                );
        }
    }

    submit(role: Role) {
        if (role.id === null) {
            this.store.add(role.name)
                .then(
                () => { this._location.back(); },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while adding an role.');
                }
                );
        } else {
            this.store.update(role)
                .then(
                () => { this._location.back(); },
                (error) => {
                    if (Logger.isEnabled) {
                        Logger.dir(error);
                    }
                    alert('An error occurred while updating a role.');
                }
                );
        }
    }

    cancel() {
        this._location.back();
    }

}
