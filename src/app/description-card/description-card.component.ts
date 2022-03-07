/**
 * The DescriptionCardComponent is used to render descriptions of movies.
 * @module DescriptionCardComponent
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-description-card',
  templateUrl: './description-card.component.html',
  styleUrls: ['./description-card.component.scss']
})

/**
 *
 * @param data
 */
export class DescriptionCardComponent implements OnInit {

    constructor(
      @Inject(MAT_DIALOG_DATA)
      public data: {
        Title: string;
        Description: string;
      }
    ) { }
  
    ngOnInit(): void {
    }
  
  }