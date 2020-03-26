import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { Post } from '../post.model';
import { PostServices } from '../post.service';

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit,OnDestroy{

  constructor(public postServices:PostServices){}               //To inject
  posts: Post[] = []
  private postSub : Subscription;      // To subcribe and unsubcribe only when required (to prevent memory leaks)

  ngOnInit(){
     this.postServices.getPosts();
     this.postSub = this.postServices.getPostsUpdateListner()
      .subscribe((posts: Post[])=>{
        this.posts = posts
      })
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
}
