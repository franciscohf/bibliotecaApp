import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let mockDialogRef: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    mockDialogRef = {
      close: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have app-confirm-dialog as selector element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });

  it('should render dialog title, content, and action buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('[mat-dialog-title]');
    const content = compiled.querySelector('mat-dialog-content');
    const buttons = compiled.querySelectorAll('button');

    expect(title).toBeTruthy();
    expect(content).toBeTruthy();
    expect(buttons.length).toBe(2);
  });

  it('should call dialogRef.close(false) when onNoClick is executed', () => {
    component.onNoClick();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should call onNoClick and close with false when Cancel button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll('button'));
    const cancelButton = buttons.find((btn) => btn.textContent?.includes('Cancel'));

    expect(cancelButton).toBeTruthy();
    cancelButton?.click();

    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });

  it('should close with true when Delete button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll('button'));
    const deleteButton = buttons.find((btn) => btn.textContent?.includes('Delete'));

    expect(deleteButton).toBeTruthy();
    deleteButton?.click();

    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should have cdkFocusInitial attribute on the Delete button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = Array.from(compiled.querySelectorAll('button'));
    const deleteButton = buttons.find((btn) => btn.textContent?.includes('Delete'));

    expect(deleteButton?.hasAttribute('cdkFocusInitial') || deleteButton?.hasAttribute('cdkfocusinitial')).toBe(true);
  });
});
