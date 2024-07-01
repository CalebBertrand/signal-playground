import { Component, effect, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'signal-playground';

  myState = signal(1);
  myStateObservableFromSignal = toObservable(this.myState);

  myStateObservable = new BehaviorSubject(1);
  myStateSignalFromObservable = toSignal(this.myStateObservable);

  logChanges = effect(() => {
    // This will only log 4, because signals wait for the state to stabilize
    console.log('Signal state:', this.myState());
  });

  // Converting a signal to an observable does not change this behavior
  logObservableFromSignalChanges = this.myStateObservableFromSignal.subscribe((value) => {
    console.log('Signal converted to an observable state:', value);
  });

  // Observables do not wait for the state to stabilize. Also note that this will run before the component is fully initialized
  // while all the others will run after
  logObservableChanges = this.myStateObservable.subscribe((value) => {
    console.log('Observable state:', value);
  });

  // Converting an observable to a signal will still wait for the state to stabilize
  logSignalFromObservableChanges = effect(() => {
    console.log('Signal from observable state:', this.myStateSignalFromObservable());
  });

  constructor() {
    this.myState.update(() => 2);
    this.myState.update(() => 3);
    this.myState.update(() => 4);

    this.myStateObservable.next(2);
    this.myStateObservable.next(3);
    this.myStateObservable.next(4);
  }
}
