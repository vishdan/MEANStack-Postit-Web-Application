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
  posts: Post[] = []
  isLoading = false;

  constructor(public postServices:PostServices){}               //To inject
  private postSub : Subscription;      // To subcribe and unsubcribe only when required (to prevent memory leaks)

  ngOnInit(){
     this.isLoading = true
     this.postServices.getPosts();
     this.postSub = this.postServices.getPostsUpdateListner()
      .subscribe((posts: Post[])=>{
        this.posts = posts
        this.isLoading = false
      })
  }

  postDelete(postid: string){
    this.postServices.deletePost(postid);
  }

  ngOnDestroy(){
    this.postSub.unsubscribe();
  }
}
