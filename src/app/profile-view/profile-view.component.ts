import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})

export class ProfileViewComponent implements OnInit {
  public data = {
    Username: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  }
  
    constructor(
      private router: Router,
      // @Inject(MAT_DIALOG_DATA)
      
    ) { }
  
    goToMovieCard(): void {
      this.router.navigate(['movies']);
    }

    updateInfo(): void {
      
    }

    ngOnInit(): void {
      if (localStorage.getItem('user') != null) {
        let userData: any = localStorage.getItem('user');
        this.data = JSON.parse(userData);
        console.log(this.data)
      };

    }
  
  }