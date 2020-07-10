import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

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
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
            };
          });
        })
      )
      .subscribe((postTransformed) => {
        this.posts = postTransformed;
        this.postsUpdates.next([...this.posts]); //  Emits after updating posts      //OBSERVER
      });
  }

  getPost(postId: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string
    }>("http://localhost:3000/api/posts/" + postId);
  }

  getPostsUpdateListner() {
    return this.postsUpdates.asObservable(); // Returns an object to a Listner //OBSERVABLE
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath,
        };
        this.posts.push(post); // Updates posts
        this.postsUpdates.next([...this.posts]); //  Emits after updating posts      //OBSERVER
        this.router.navigate(["/"]);
      });
  }

  updatePost(
    postId: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", postId);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image);
    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + postId, postData)
      .subscribe((response) => {
        const updatedPost = [...this.posts];
        const oldPostIndex = updatedPost.findIndex((p) => p.id === postId);
        const post: Post = {
          id: postId,
          title: title,
          content: content,
          imagePath: "",
        };
        updatedPost[oldPostIndex] = post;
        this.postsUpdates.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/posts/" + postId)
      .subscribe(() => {
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.postsUpdates.next([...this.posts]);
      });
  }
}
