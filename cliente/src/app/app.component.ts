import { User } from './models/user';
import { UserService } from './services/user.service';
import { Component, OnInit } from '@angular/core';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService],
})
export class AppComponent implements OnInit {
  public title = 'Tico Beats';
  public user: User;
  public user_register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(private _userService: UserService) {
    this.user = new User('', '', '', '', '', 'Role_User', '');
    this.user_register = new User('', '', '', '', '', 'Role_User', '');
    this.url = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  public onSubmit() {
    console.log(this.user);

    // conseguir los datos del usuario identificado
    this._userService.signup(this.user).susbcribe(
      (response) => {
        let identity = response.user;
        this.identity = identity;

        if (!this.identity._id) {
          alert('El usuario no esta correctamente identificado');
        } else {
          //crear elemento en el localstorage para tener al usuario sesion
          localStorage.setItem('identity', JSON.stringify(identity));

          //conseguir el token para enviarselo a cada peticion
          this._userService.signup(this.user, 'true').susbcribe(
            (response) => {
              let token = response.token;
              this.token = token;

              if (this.token.length <= 0) {
                alert('El token no se ha generado correctamente');
              } else {
                //crear elemento en el localstorage para tener toekn disponible
                localStorage.setItem('token', token);

                this.user = new User('', '', '', '', '', 'Role_User', '');
              }
            },
            (error) => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
                console.log(error);
              }
            }
          );
        }
      },
      (error) => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
          console.log(error);
        }
      }
    );
  }
  logout() {
    localStorage.removeItem('identity');
    localStorage.removeItem('identity');
    localStorage.clear();
    this.identity = null;
    this.token = null;
  }

  onSubmitRegister() {
    console.log(this.user_register);

    this._userService.register(this.user_register).subscribe(
      (response) => {
        let user = response.user;
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister =
            'el registro se ha realizado correctamente, identificate con' +
            this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
        }
      },

      (error) => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
          console.log(error);
        }
      }
    );
  }
}
