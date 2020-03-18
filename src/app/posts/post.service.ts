import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

import { Post } from "./post.model";

@Injectable({providedIn:'root'})
export class PostServices{
  private posts: Post[] = [];
  private postsUpdates = new Subject<Post[]>();

  getPosts(){
    return [...this.posts]
  }

  getPostsUpdateListner(){
    return this.postsUpdates.asObservable();      // Returns an object to a Listner //OBSERVABLE
  }

  addPosts(title:string, content:string){
    const post:Post = {title:title, content:content}
    this.posts.push(post)                           // Updates posts
    this.postsUpdates.next([...this.posts])         //  Emits after updating posts      //oBSERVER
  }
}
