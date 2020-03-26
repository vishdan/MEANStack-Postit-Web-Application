import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostServices } from '../post.service';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent {
  constructor(public postservices:PostServices){}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.postservices.addPosts(form.value.title,form.value.content)
    form.reset();
  }
}
