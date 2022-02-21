import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserRegistrationService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.scss']
})

export class UpdateInfoComponent implements OnInit {

  @Input() newData = { Username: '', Password: '', Email: '', Birthday: '' };

  constructor(
    public fetchApiData: UserRegistrationService,
    public dialogRef: MatDialogRef<UpdateInfoComponent>,
    public snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      username: string;
      password: string;
      email: string;
      birthday: Date;
    }
  ) { }

  ngOnInit(): void {
  }

  editUser(): void {
    //prevent sending an empty field (that would erase the previous data and replace it with null)
    if (this.newData.Username && this.newData.Password && this.newData.Email && this.newData.Birthday) {
      this.fetchApiData.editUser(this.newData).subscribe((resp: any) => {
        this.dialogRef.close();
        window.location.reload();
        localStorage.setItem('user', JSON.stringify(resp));
        this.snackbar.open('Data successfully updated', 'OK', { duration: 2000 })
      });
      //alert when submitting an empty field
    } else {
      this.snackbar.open('Plase fill all the fields', 'OK', { duration: 2000 })
    }
  }

}
