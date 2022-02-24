import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../fetch-api-data.service'
import { UpdateInfoComponent } from '../update-info/update-info.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { DescriptionCardComponent } from '../description-card/description-card.component';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})

export class ProfileViewComponent implements OnInit {
  favoriteMovies: any[] = [];
  public user: any = {
    Username: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  }
  
    constructor(
      public fetchApiData: UserRegistrationService,
      private router: Router,
      public dialog: MatDialog,
      // @Inject(MAT_DIALOG_DATA)
      
    ) { }
  
    goToMovieCard(): void {
      this.router.navigate(['movies']);
    }

    openUpdateInfoCard(): void {
      this.dialog.open(UpdateInfoComponent, {
        width: '500px'
      });
    }

    // this function runs through the list of all movies checking to see whether their _id matches the _ids in data.FavoriteMovies. Whenever there's a match, the movie,
    // with all its details, is pushed into this.favoriteMovies
    getFaves(): Array<Object> {
      let movies: any[] = [];
      // let userData: any = localStorage.getItem('user');
      // this.data = JSON.parse(userData);
      this.fetchApiData.getAllMovies().subscribe((res: any) => {
        movies = res;
        movies.forEach((movie) => {
          if (this.user.FavoriteMovies.includes(movie._id)) {
            this.favoriteMovies.push(movie);
          }
        });
      });
      return this.favoriteMovies;
    }

    openDirector(name: string, bio: string, birth: string, death: string): void {
      this.dialog.open(DirectorCardComponent, {
        data: {
          Name: name,
          Bio: bio,
          Birth: birth,
          Death: death,
        },
        width: '500px'
      });
    }
  
    openGenre(name: string, description: string): void {
      this.dialog.open(GenreCardComponent, {
        data: {
          Name: name,
          Description: description,
        },
        width: '500px'
      });
    }
  
    openDescription(name: string, description: string): void {
      this.dialog.open(DescriptionCardComponent, {
        data: {
          Title: name,
          Description: description,
        },
        width: '500px'
      });
    }

    ngOnInit(): void {
      if (localStorage.getItem('user') != null) {
        let userData: any = localStorage.getItem('user');
        this.user = JSON.parse(userData);
        console.log(this.user)
      };
      this.getFaves();

    }

    signOut(): void {
      this.router.navigate(['welcome']);
      localStorage.clear();
    }
  
  }


