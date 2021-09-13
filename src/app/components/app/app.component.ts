import { CountService } from './../../services/count.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  countForm: FormGroup;
  data: any;

  constructor(private countService: CountService) {
    this.countForm = new FormGroup({
      distance: new FormControl('10', [Validators.required, Validators.pattern("^[0-9]+$")]),
      age: new FormControl('10', [Validators.required, Validators.pattern("^[0-9]+$")]),
      weight: new FormControl('25', [Validators.required, Validators.pattern("^[0-9]+$")])
    });
  }

  onSubmit(): void {
    const value: { [k: string]: string } = this.countForm.value;
    const values: [string, number][] = Object.entries(value).map(([name, value]) => [name, parseInt(value, 10)])
    const { distance, age, weight } = getObjromArr(values);
    const result = this.countService.getPrice({ distance, age, weight });
    this.data = result;
  }

}

function getObjromArr(arr: [string, any][]): { [k: string]: any } {
  const result: { [k: string]: any } = {};
  arr.forEach(([name, value]) => {
    result[name] = value;
  })
  return result;
}