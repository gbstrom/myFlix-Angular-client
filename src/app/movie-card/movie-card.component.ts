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
  user: any[] = [];
  currentUsersFaves: any[] =[];
  constructor(
    public fetchApiData: UserRegistrationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.getMovies();
    // this.getCurrentUser();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getCurrentUser(username: string): void {
    this.fetchApiData.getUser(username).subscribe((resp: any) => {
      this.user = resp;
      this.currentUsersFaves = resp.FavoriteMovies;
      return (this.user, this.currentUsersFaves);
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
      this.ngOnInit();
      this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
    });
  }

}