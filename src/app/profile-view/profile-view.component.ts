/**
 * The ProfileViewComponent is used to view the user profile & favorites.
 * @module ProfileViewComponent
 */
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserRegistrationService } from '../fetch-api-data.service'
import { UpdateInfoComponent } from '../update-info/update-info.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { DescriptionCardComponent } from '../description-card/description-card.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})

export class ProfileViewComponent implements OnInit {
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
      private router: Router,
      public snackBar: MatSnackBar,
      public dialog: MatDialog,
      // @Inject(MAT_DIALOG_DATA)
      
    ) { }
  
    ngOnInit(): void {
      this.getUser();
      this.getMoviesAndFaves();
    }


    /**
     * call API endpoint to get user info
     * @function getUser
     */
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
  
    /**
     * call API endpoint to get all the movies in the database, then sets the currentUsersFaves variable to the set of movies that are stored
     * as favorites in this.user.FavoriteMovies.
     * @function getMoviesAndFaves
     */
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

    /**
     * function that gets the router to navigate to the MovieCardComponent
     * @function goToMovieCard
     */
    goToMovieCard(): void {
      this.router.navigate(['movies']);
    }

    /**
     * open a dialog to edit the profile of the user
     * @module openUpdateInfoCard
     */
    openUpdateInfoCard(): void {
      this.dialog.open(UpdateInfoComponent, {
        width: '500px'
      });
    }

    /**
     *open a dialog to display the DirectorCardComponent
     * @module openDirector
     * @param name {string}
     * @param bio {string}
     * @param birth {string}
     * @param death {string}
     */
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
  
    /**
     *open a dialog to display the GenreCardComponent
     * @module openGenre
     * @param name {string}
     * @param description {string}
     */
    openGenre(name: string, description: string): void {
      this.dialog.open(GenreCardComponent, {
        data: {
          Name: name,
          Description: description,
        },
        width: '500px'
      });
    }

    /**
     *open a dialog to display the DescriptionCardComponent
     * @module openDescription
     * @param name {string}
     * @param description {string}
     */
    openDescription(name: string, description: string): void {
      this.dialog.open(DescriptionCardComponent, {
        data: {
          Title: name,
          Description: description,
        },
        width: '500px'
      });
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

    /**
     * call API endpoint to remove a movie from user's favorites. Also revises the currentUsersFaves variable so that it 
     * no longer includes the disfavored movie.
     * @function removeFromFavorites
     * @param movieId {string}
     */
    removeFromFavorites(movieId: string): void {
      this.fetchApiData.deleteFavoriteMovie(movieId).subscribe((resp: any) => {
        const previousFavesWithDisfavoredMovieRemoved = this.currentUsersFaves.filter(movie => movie._id !== movieId);
        this.currentUsersFaves = previousFavesWithDisfavoredMovieRemoved;
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
      })
    }
  
    /**
     * function used to monitor the favorite status of each movie. This is used to determine whether to display the fave icon or
     * the not-fave icon.
     * @function itIsAFave
     * @param movieId {string}
     * @return Boolean
     */
    itIsAFave(movieId: string): any {
      const movieArray: any[] = this.currentUsersFaves;
      if(movieArray.some(movie => movie._id === movieId)){
        return true;
      } else {
        return false;
      }
    }  

    /**
     * function that gets the router to navigate to the welcome page when a user signs out.
     * @function signOut
     */
    signOut(): void {
      this.router.navigate(['welcome']);
      localStorage.clear();
    }
  
  }


