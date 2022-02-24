import { Component, OnInit } from '@angular/core';
import { UserRegistrationService } from '../fetch-api-data.service'
import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { DescriptionCardComponent } from '../description-card/description-card.component';
import { defaultThrottleConfig } from 'rxjs/internal/operators/throttle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})

export class MovieCardComponent {
  movies: any[] = [];
  user: any = {
    Username: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  }
  currentUsersFaves: any[] =[];
  faveBoolean: boolean = false;

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getFavorites();
  };

  async getUser() {
    // this code sets the user object to the user found in localStorage
    if (localStorage.getItem('user') != null) {
      let userData: any = localStorage.getItem('user');
      let username = JSON.parse(userData).Username;
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        this.user = resp;
      });
  
    };
  }

  async getFavorites() {
    // this code sets the currentUsersFaves variable to the set of movies that the database has recorded as favorites for the user.
    this.fetchApiData.getAllMovies().subscribe((res: any) => {
      this.movies = res;
      this.movies.forEach((movie) => {
        if (this.user.FavoriteMovies.includes(movie._id)) {
          this.currentUsersFaves.push(movie);
        }
      });
    });
  
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
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

  openProfile(): void {
    this.router.navigate(['/profile']);
  }

  addToFavorites(movieId: string): void {
    this.fetchApiData.addFavoriteMovie(movieId).subscribe((resp: any) => {
      this.getFavorites();
      // this.itIsAFave(movieId);
      console.log("the itIsAFave value of " + movieId + " is " + this.faveBoolean)
      this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
    });
  }

  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((resp: any) => {
      this.fetchApiData.getAllMovies().subscribe((res: any) => {
        this.movies = res;
        this.movies.forEach((movie) => {
          if (this.user.FavoriteMovies.includes(movie._id)) {
            this.currentUsersFaves.push(movie);
          }
        });
      });
      this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
    })
  }


  // I tried to make the ngIf in the component work by linking it to this function, but it did not work.
  // itIsAFave(movieId: string): any {
  //   let faveIds = this.currentUsersFaves.map(function (fav: any) { return fav._id });
  //   if (faveIds.includes(movieId)) {
  //     this.faveBoolean = true;
  //     return this.faveBoolean;
  //   };
  // }

  signOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}