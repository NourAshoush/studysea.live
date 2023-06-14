import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs/esm';

import { ModalService } from '../../shared/modal/modal.service';
import { IUser } from '../../admin/user-management/user-management.model';

@Component({
  selector: 'jhi-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss'],
})

/*
This is the component which displays and handles the manual creation of
a post via pressing on the 'Create Post' button on the feed page.
 */
export class CreatePostComponent implements OnInit {
  titleInput: string = '';
  descriptionInput: string = '';
  username: string;
  titleProvidedCondition: boolean = true;

  constructor(public modalService: ModalService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsername();
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    this.modalService.showCreatePost = false;
  }

  /*
  This function is called when a key is pressed when the create post screen
  is active. It's input comes from the EventListener created in the init above.
  When the escape key is pressed, the modal is destroyed.
  When shift and enter keys are pressed, it attempts to post the given details.
   */
  handleKeyUp(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.ngOnDestroy();
    } else if (event.shiftKey && event.key === 'Enter') {
      this.postPost();
    }
  }

  /*
  The following two functions get the inputs from the title and description
  fields respectively. For the title input, since it cannot be null, if the
  user leaves it to be empty (by deleting their given input), the variable
  titleProvidedCondition will be false, but if there is an input, true.
   */
  getTitleInput(titleValue: string): void {
    this.titleInput = titleValue;
    this.titleProvidedCondition = this.titleInput != '';
  }

  getDescriptionInput(descriptionValue: string): void {
    this.descriptionInput = descriptionValue;
  }

  /*
  This function gets the current user's username and stores it in the
  username variable and gets the current time and stores it in currenTime.
  Both get the necessary information to create a post.
   */
  getUsername(): void {
    // @ts-ignore
    this.http.get('/api/account').subscribe((data: IUser) => {
      // @ts-ignore
      this.username = data.login;
    });
  }

  /*
  Creates a new post with the inputs given by the user. Does
  a check to ensure title input field is not null. Executes a
  HTTP Post call then runs ngOnDestroy and reloads the page to
  display the new post.
   */
  public postPost() {
    if (!(this.titleInput === '')) {
      let postBody = {
        createdBy: this.username,
        creationTime: dayjs(),
        title: this.titleInput,
        description: this.descriptionInput,
        likes: 0,
        likedBy: '',
      };

      this.http.post('/api/posts', postBody).subscribe();

      this.ngOnDestroy();

      window.location.reload();
    } else this.titleProvidedCondition = this.titleInput != '';
  }
}
