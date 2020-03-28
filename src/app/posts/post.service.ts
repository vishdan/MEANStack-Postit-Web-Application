import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from '@angular/router';

import { Post } from "./post.model";


@Injectable({ providedIn: "root" })
export class PostServices {
  private posts: Post[] = [];
  private postsUpdates = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {} //To inject we use the constructor

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>("http://localhost:3000/api/posts")
      .pipe(
        map(postData => {
          return postData.posts.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content
            };
          });
        })
      )
      .subscribe(postTransformed => {
        this.posts = postTransformed;
        this.postsUpdates.next([...this.posts]); //  Emits after updating posts      //OBSERVER
      });
  }

  getPost(postId: string) {
    return this.http.get<{_id:string, title:string, content: string}>("http://localhost:3000/api/posts/" + postId);
  }

  getPostsUpdateListner() {
    return this.postsUpdates.asObservable(); // Returns an object to a Listner //OBSERVABLE
  }

  addPosts(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; id: string }>(
        "http://localhost:3000/api/posts",
        post
      )
      .subscribe(responseData => {
        post.id = responseData.id;
        this.posts.push(post); // Updates posts
        this.postsUpdates.next([...this.posts]); //  Emits after updating posts      //OBSERVER
        this.router.navigate(['/']);
      });
  }

  updatePost(postId: string, title: string, content: string) {
    const post = { id:postId, title: title, content: content };
    this.http
      .put("http://localhost:3000/api/posts/" + postId, post)
      .subscribe(response => {
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex(p => p.id === post.id);
        updatedPost[oldPostIndex] = post;
        this.postsUpdates.next([...this.posts])
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== postId);
        this.postsUpdates.next([...this.posts]);
      });
  }
}
