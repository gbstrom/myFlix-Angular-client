/**
 * The UserLoginFormComponent is used to login users.
 * @module UserLoginFormComponent
 */
import { Component, OnInit, Input } from '@angular/core';
// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';
// This import brings in the API calls we created in 6.2
import { UserRegistrationService } from '../fetch-api-data.service';
// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  /**
   * This binds data entered by the user to the userData object.
   */
  @Input() userData = { Username: '', Password: ''};

  constructor(    
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
  }

/**
 * This function makes an API call to login the user, then receives a JSON object including JWT and user data,
 * which gets stored in localStorage as 'token' and 'user'
 * @function loginUser
 */
loginUser(): void {
  this.fetchApiData.userLogin(this.userData).subscribe((result) => {
    this.dialogRef.close(); // This will close the modal on success!

    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(result.user));

    this.snackBar.open(result, 'OK', {
      duration: 2000
    });
    this.router.navigate(['movies']);
  }, (result) => {
    this.snackBar.open(result, 'OK', {
      duration: 2000
    });
  });
}

}
