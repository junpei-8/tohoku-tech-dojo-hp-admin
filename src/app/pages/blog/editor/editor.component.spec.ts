import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BlogEditorPageComponent } from './editor.component';

describe('BlogEditorPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BlogEditorPageComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(BlogEditorPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
