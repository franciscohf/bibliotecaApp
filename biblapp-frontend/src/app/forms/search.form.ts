import { Injectable, signal } from '@angular/core';

export interface SearchFilterState {
  cedula: string;
  fullname: string;
  startDate: Date | null;
  endDate: Date | null;
}

const emptyFilter = (): SearchFilterState => ({
  cedula: '',
  fullname: '',
  startDate: null,
  endDate: null,
});

@Injectable()
export class SearchForm {
  readonly $model = signal<SearchFilterState>(emptyFilter());

  readonly cedula = () => this.$model().cedula;
  readonly fullname = () => this.$model().fullname;
  readonly startDate = () => this.$model().startDate;
  readonly endDate = () => this.$model().endDate;

  setCedula(cedula: string) {
    this.$model.update((m) => ({ ...m, cedula }));
  }

  setFullname(fullname: string) {
    this.$model.update((m) => ({ ...m, fullname }));
  }

  setStartDate(startDate: Date | null) {
    this.$model.update((m) => ({ ...m, startDate }));
  }

  setEndDate(endDate: Date | null) {
    this.$model.update((m) => ({ ...m, endDate }));
  }

  setDates(startDate: Date | null, endDate: Date | null) {
    this.$model.update((m) => ({ ...m, startDate, endDate }));
  }

  value(): SearchFilterState {
    return this.$model();
  }

  reset() {
    this.$model.set(emptyFilter());
  }
}
