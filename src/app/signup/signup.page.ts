import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  username;
  password;
  email;
  constructor() { }

  ngOnInit() {
  }

  signmeup(){
    console.log('username:' ,this.username);
    console.log('password:' ,this.password);
    console.log('email:' ,this.email);

    const user = new Moralis.User();
    user.set("username", "my name");
    user.set("password", "my pass");
    user.set("email", "email@example.com");

    // other fields can be set just like with Moralis.Object
    user.set("phone", "415-392-0202");
    try {
      await user.signUp();
      // Hooray! Let them use the app now.
    } catch (error) {
      // Show the error message somewhere and let the user try again.
      alert("Error: " + error.code + " " + error.message);
    }

  }

}
