import { Component, OnInit, Input } from '@angular/core';
import { PostService } from 'src/app/features/blog-post/services/post.service';
import { UserService } from 'src/app/features/user/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PostPhotoService } from '../services/post-photo.service';
import { PostPhotoDto } from '../models/add-post-photo.model';
import { User } from '../../user/models/user.model';

@Component({
  selector: 'app-random-user-posts',
  templateUrl: './random-user-posts.component.html',
  styleUrls: ['./random-user-posts.component.css']
})
export class RandomUserPostsComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4; // Display 4 items per page
  postImages: { [key: string]: string[] } = {}; // Store images for each post
  authorId: string = '';
  authorName: string = ''; // Store author's name
  loading: boolean = true; // Add a loading state

  @Input() authorIdInput: string = ''; // Assuming this will be passed as input if using the component directly

  constructor(
    private postService: PostService,
    private postPhotoService: PostPhotoService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // If authorId is not passed as an input, get it from the route parameters
    if (!this.authorIdInput) {
      this.route.paramMap.subscribe(params => {
        this.authorId = params.get('userId') || '';
        this.loadAuthorName(); // Load the author's name
        this.loadAuthorPosts();
      });
    } else {
      this.authorId = this.authorIdInput;
      this.loadAuthorName(); // Load the author's name
      this.loadAuthorPosts();
    }
  }

  loadAuthorName(): void {
    console.log('Fetching user with ID:', this.authorId); // Debug log
    this.userService.getUserById(this.authorId).subscribe(
      (user: User) => {
        if (user) {
          this.authorName = user.Name; // Set the author's name
          console.log('Author name loaded:', this.authorName); // Debug log
        } else {
          console.warn('User not found for ID:', this.authorId); // Log if user is not found
          this.authorName = 'Author Not Found'; // Default message if not found
        }
      },
      error => {
        console.error('Error fetching author name:', error);
        this.authorName = 'Author Not Found'; // Default message on error
      }
    );
  }
  
  
  loadAuthorPosts(): void {
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data.filter(post => post.UserId === this.authorId);
      this.filteredPosts = [...this.posts]; // Initialize filteredPosts with author posts

      // Sort posts by CreatedAt (most recent first)
      this.posts.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

      this.posts.forEach(post => {
        this.loadImagesForPost(post.PostId);
      });
    });
  }

  loadImagesForPost(postId: string): void {
    this.postPhotoService.getPhotosByPostId(postId).subscribe((images: PostPhotoDto[]) => {
      this.postImages[postId] = []; // Initialize image array for the post

      images.forEach((img: PostPhotoDto) => {
        if (img.IsImage === 1) {
          const byteCharacters = atob(img.PhotoContent);
          const byteNumbers = new Uint8Array(byteCharacters.length);

          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }

          const blob = new Blob([byteNumbers], { type: img.FileType });
          const reader = new FileReader();

          reader.onloadend = () => {
            if (typeof reader.result === 'string') {
              this.postImages[postId].push(reader.result); // Add image URL to the post
            }
          };
          reader.readAsDataURL(blob);
        }
      });
    }, (error) => {
      console.error('Error fetching images:', error);
    });
  }

  onSearch(): void {
    this.filteredPosts = this.posts.filter(post =>
      post.Title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.currentPage = 1;
  }

  viewPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  get paginatedPosts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredPosts.slice(start, end);
  }

  get totalPages() {
    return Math.ceil(this.filteredPosts.length / this.itemsPerPage);
  }
}
