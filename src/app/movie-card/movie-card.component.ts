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
    console.log("at the end of ngOnInit(), the value of currentUsersFaves is " + this.currentUsersFaves);
    console.log(this.currentUsersFaves);
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
      let element = {name: "monkey"}
        if (this.user.FavoriteMovies.includes(movie._id)) {
          this.currentUsersFaves.push(movie);
        }
      });
    });
    console.log('at the end of this.getFavorites(), the value of currentUsersFaves is ' + this.currentUsersFaves);
    console.log(this.currentUsersFaves);
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

  itIsAFave(movieId: string): any {
    // As far as I can tell, this is good code, but still ngIf doesn't behave itself--
    const movieArray: any[] = this.currentUsersFaves;

    if(movieArray.some(movie => movie._id === movieId)){
      console.log('itIsAFave claims that movieArray includes ' + movieId)
      return true;
    } else {
      console.log('itIsAFave denies that gregsArray includes ' + movieId)
      return false;
    }

    // This is all nonsense that I will delete eventually, that helped me troubleshoot.
    // const movieArray: any[] = [{ _id: "60f1cc137a111c2a24f78e1b", Title: "Rear Window", Description: "A photogropher and his socialite girlfriend inadvertently come to suspect that one of their neighbors has murdered his wife in this Hitchcock classic."},
    // { _id: "60f1cc667a111c2a24f78e1c", Title: "The 39 Steps", Description: "Through a sequence of unlikely circumstances a Canadian travelling in Britain becomes a murder suspect and has to flee across the country to find clues that will clear his name and expose a secret group of spies."},
    // { _id: "60f1cda67a111c2a24f78e1f", Title: "The 40 Year Old Virgin", Description: "Hijinks ensue when the coworkers of a 40 year old salesman discover that he is still a virgin."},
    // { _id: "60f1cb077a111c2a24f78e1a", Title: "North by Northwest", Description: "An advertising executive finds himself entangled by a case of mistaken identity in a dangerous world of espionage and adventure in one of Hitchcock's most beloved movies"},
    // { _id: "60f1cd3b7a111c2a24f78e1e", Title: "Late Spring", Description: "A devoted daughter struggles to accept change when her father realizes that it is time for her to get married."},
    // { _id: "60f1ca927a111c2a24f78e19", Title: "The Lego Batman Movie", Description: "Batman has to face his greatest fear to save Gotham City from the Joker while learning to work with the new police commissioner."}]
    // const gregsArray: any[] = [{name: "Huey", species: "duck"}, {name: "Dewey", species: "duck"}, {name: "Louie", species: "duck"}];
    // if(gregsArray.some(duck => duck.name === "Huey")){
    //   console.log('itIsAFave claims that gregsArray includes Huey')
    //   return true;
    // } else {
    //   console.log('itIsAFave denies that gregsArray includes Huey')
    //   return false;
    // }

    // console.log('itIsAFave claims that it is ' + gregsArray.includes(7) + " that gregsArray includes 7");
    // console.log("itIsAFave is running, and the ")
    // if (this.currentUsersFaves.includes(movieId)) {
    //   console.log("itIsAFave is true about " + movieId)
    // } else {
    //   console.log("itIsAFave is false about " + movieId + " and yet currentUsersFaves is");
    //   console.log(this.currentUsersFaves);
    // };
  }

  signOut(): void {
    this.router.navigate(['welcome']);
    localStorage.clear();
  }
}