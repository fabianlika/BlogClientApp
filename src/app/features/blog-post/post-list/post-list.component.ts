import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/features/blog-post/services/post.service';
import { Router } from '@angular/router';
import { PostPhotoService } from '../services/post-photo.service';
import { PostPhotoDto } from '../models/add-post-photo.model';
import { PaginationComponent } from '../../tablePagination/pagination/pagination.component';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
  //imports: [PaginationComponent] // Import the standalone PaginationComponent
})
export class PostListComponent implements OnInit {
  posts: any[] = [];
  filteredPosts: any[] = [];
  categories: { CategoryId: string, Name: string }[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 4; // Display 4 items per page
  postImages: { [key: string]: string[] } = {};
  isModalOpen: boolean = false; // For modal visibility
  selectedImage: string = ''; // For the selected image URL

  constructor(
    private postService: PostService,
    private postPhotoService: PostPhotoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.loadCategories();
  }

  loadPosts(): void {
    this.postService.getAllPosts().subscribe((data) => {
      this.posts = data;

      // Sort posts by CreatedAt (most recent first)
      this.posts.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

      this.filteredPosts = this.posts;

      this.posts.forEach(post => {
        this.loadImagesForPost(post.PostId);
      });
    });
  }

  loadImagesForPost(postId: string): void {
    this.postPhotoService.getPhotosByPostId(postId).subscribe((images: PostPhotoDto[]) => {
      this.postImages[postId] = [];

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
              this.postImages[postId].push(reader.result);
            }
          };
          reader.readAsDataURL(blob);
        }
      });
    }, (error) => {
      console.error('Error fetching images:', error);
    });
  }

  openImage(image: string) {
    this.selectedImage = image; // Set the selected image
    this.isModalOpen = true; // Open the modal
  }

  closeModal() {
    this.isModalOpen = false; // Close the modal
  }

  loadCategories(): void {
    this.postService.getCategories().subscribe((data: { CategoryId: string; Name: string; Url: string }[]) => {
      this.categories = data;
    });
  }
  navigateToAddPost(): void {
    this.router.navigate(['/admin/blogposts/add']); // Adjust the path as necessary
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

  filterByCategory(event: any): void {
    const selectedCategoryId = event.target.value;
    this.filteredPosts = selectedCategoryId
      ? this.posts.filter(post => post.CategoryId === selectedCategoryId)
      : this.posts;
    this.currentPage = 1;
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
