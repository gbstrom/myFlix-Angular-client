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

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getUser();
    this.getMoviesAndFaves();
  };

  getUser() {
    // this code sets the user object to the user found in localStorage
    if (localStorage.getItem('user') != null) {
      let userData: any = localStorage.getItem('user');
      let username = JSON.parse(userData).Username;
      this.fetchApiData.getUser(username).subscribe((resp: any) => {
        this.user = resp;
      });
    };
  }

  getMoviesAndFaves() {
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
      this.movies.forEach((movie) => {
        if (movie._id == movieId) {
          this.currentUsersFaves.push(movie);
        }
      });
      this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
    });
  }

  removeFromFavorites(movieId: string): void {
    this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((resp: any) => {
      const previousFavesWithDisfavoredMovieRemoved = this.currentUsersFaves.filter(movie => movie._id !== movieId);
      this.currentUsersFaves = previousFavesWithDisfavoredMovieRemoved;
      this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
    })
  }

  itIsAFave(movieId: string): any {
    const movieArray: any[] = this.currentUsersFaves;
    if(movieArray.some(movie => movie._id === movieId)){
      return true;
    } else {
      return false;
    }
  }

  signOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}