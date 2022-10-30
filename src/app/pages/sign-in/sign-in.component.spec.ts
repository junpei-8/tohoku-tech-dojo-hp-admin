import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SignInPageComponent } from './sign-in.component';

describe('TopPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SignInPageComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SignInPageComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
