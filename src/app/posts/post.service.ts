import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';

import { Post } from "./post.model";
import { strict } from 'assert';

@Injectable({providedIn:'root'})
export class PostServices{
  private posts: Post[] = [];
  private postsUpdates = new Subject<Post[]>();

  constructor(private http : HttpClient){}            //To inject we use the constructor

  getPosts(){
    this.http.get<{message: string, posts: Post[]}>('http://localhost:3000/api/posts')
    .subscribe((postData)=>{
      this.posts = postData.posts;
      this.postsUpdates.next([...this.posts])         //  Emits after updating posts      //OBSERVER
    })
  }

  getPostsUpdateListner(){
    return this.postsUpdates.asObservable();      // Returns an object to a Listner //OBSERVABLE
  }

  addPosts(title:string, content:string){
    const post:Post = {id:null, title:title, content:content}
    this.http.post<{message: string}>('http://localhost:3000/api/posts',post)
        .subscribe((responseData)=>{
          console.log(responseData);
          this.posts.push(post)                           // Updates posts
          this.postsUpdates.next([...this.posts])         //  Emits after updating posts      //OBSERVER
        })
  }
}
