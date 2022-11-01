import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewsEditorPageComponent } from './news.component';

describe('NewsEditorPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NewsEditorPageComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(NewsEditorPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
