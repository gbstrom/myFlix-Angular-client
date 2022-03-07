import { Injectable } from '@angular/core';
// import { catchError } from 'rxjs/internal/operators'; note that I import this from rxjs/operators instead because this one seems not to work.
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


/** 
 * This declares the api url that will provide data for the client app
 */
const apiUrl = 'https://cfmovieapp.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  /**
   * Here we inject the HttpClient module to the constructor params.
   * This will provide HttpClient to the entire class, making it available via this.http
   * @param http
   */
  constructor(private http: HttpClient) {
  }
  
  /** Make API call to the user registration endpoint
   * @funtion userRegistration
   * @param userDetails
   * @returns a JSON object with user info (name, birthday, email)
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  /**
   * Make API call to the user login endpoint
   * @param userDetails 
   * @returns JSON object with JWT and user info, including favorites.
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
    catchError(this.handleError)
    );
  }
  
  /**
   * Make API call to get all movies
   * @returns Array of movie objects.
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Non-typed response extraction
   * @param res {any}
   * @returns response || empty object
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  /**
   * Makes the API call to get one particular movie
   * @param movieID 
   * @returns object with data about the given movie
   */
  getMovie(movieID: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to get more information about a particular director
   * @param directorName 
   * @returns object with data about the given director
   */
  getDirector(directorName: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'directors/' + directorName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to get more information about a particular genre
   * @param genreName 
   * @returns object with data about the given genre
   */
  getGenre(genreName: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'genres/' + genreName, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to get information about a particular user
   * @param username 
   * @returns object with all information about a user, including favorites
   */
  getUser(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to get information about the user's favorites.
   * @param username 
   * @returns object with a key of "Favorites" whose value is an array of the movieIDs of the user's favorites
   */
  getFavorites(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'users/' + username + '/favorites', {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to add a movie to the user's favorites.
   * @param movieID
   * @returns object with information about the user, including the updated collection of favorites
   */
  addFavoriteMovie(movieID: any): Observable<any> {
    // These lines are needed because the user in localStorage is a string, so we have to change it to an object, and then extract the username from that object--
    const user: any = localStorage.getItem('user');
    const userObject: any = JSON.parse(user);
    const username: any = userObject.Username;
    // The rest is explanatory:
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + 'users/' + username + '/movies/' + movieID, {}, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to remove a movie to the user's favorites.
   * @param movieID
   * @returns object with information about the user, including the updated collection of favorites
   */
  deleteFavoriteMovie(movieID: any): Observable<any> {
    // These lines are needed because the user in localStorage is a string, so we have to change it to an object, and then extract the username from that object--
    const user: any = localStorage.getItem('user');
    const userObject: any = JSON.parse(user);
    const username: any = userObject.Username;
    // The rest is explanatory:
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username + '/movies/' + movieID, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to edit a user's info
   * @param userDetails 
   * @returns object with information about the user, including favorites
   */
  editUser(userDetails: any): Observable<any> {
    // These lines are needed because the user in localStorage is a string, so we have to change it to an object, and then extract the username from that object--
    const user: any = localStorage.getItem('user')
    const userObject: any = JSON.parse(user);
    const username: any = userObject.Username;
    // The rest is explanatory:
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + username, userDetails, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * Makes the API call to delete a user
   * @param username 
   * @returns string (if successful: "exampleUser was deleted.")
   */
  deleteUser(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }
}