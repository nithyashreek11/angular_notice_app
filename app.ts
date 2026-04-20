import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NoticeService } from '../../services/notice.service';
import { NoticeCategory, CATEGORIES } from '../../models/notice';

@Component({
  selector: 'app-notice-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="header">
        <h1> Institute Notice Board</h1>
        <p>Stay updated with latest announcements</p>
      </div>
      
      <!-- Stats -->
      <div class="stats">
        <div class="stat-box">
          <span class="number">{{ noticeService.totalNotices() }}</span>
          <span class="label">Total Notices</span>
        </div>
        <div class="stat-box important">
          <span class="number">{{ noticeService.importantNotices().length }}</span>
          <span class="label">Important</span>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <input type="text" placeholder=" Search notices..." 
               (input)="onSearch($any($event.target).value)" class="search-input">
        <select (change)="onCategoryChange($any($event.target).value)" class="category-select">
          <option value="All">All Categories</option>
          @for (cat of categories; track cat) {
            <option [value]="cat">{{ cat }}</option>
          }
        </select>
      </div>

      <!-- Notice Grid -->
      <div class="notices-grid">
        @for (notice of filteredNotices(); track notice.id) {
          <div class="notice-card" [class.important]="notice.important">
            <div class="notice-header">
              <h3>{{ notice.title }}</h3>
              <span class="badge" [class]="notice.category.toLowerCase()">
                {{ notice.category }}
                @if (notice.important) { ⭐ }
              </span>
            </div>
            <p class="notice-desc">{{ notice.description }}</p>
            <div class="notice-meta">
              <span>👤 {{ notice.postedBy }}</span>
              <span>{{ notice.createdDate | date:'mediumDate' }}</span>
              <span>Until: {{ notice.validUntil | date:'mediumDate' }}</span>
            </div>
            <div class="notice-actions">
              <button (click)="toggleImportant(notice.id)" [class.active]="notice.important">
                {{ notice.important ? '⭐' : '☆' }}
              </button>
              <button [routerLink]="['/edit', notice.id]" class="edit-btn">edit</button>
              <button (click)="deleteNotice(notice.id)" class="delete-btn">delete</button>
            </div>
          </div>
        } @empty {
          <div class="empty"> No notices found</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 20px; }
    .header h1 { color: #333; margin-bottom: 5px; }
    .header p { color: #666; }
    
    .stats { display: flex; gap: 15px; margin-bottom: 20px; }
    .stat-box {
      flex: 1; background: #3f51b5; color: white;
      padding: 20px; border-radius: 8px; text-align: center;
    }
    .stat-box.important { background: #f44336; }
    .stat-box .number { font-size: 2rem; font-weight: bold; display: block; }
    .stat-box .label { font-size: 0.9rem; opacity: 0.9; }
    
    .filters { display: flex; gap: 10px; margin-bottom: 20px; }
    .search-input, .category-select {
      padding: 12px; border: 1px solid #ddd; border-radius: 6px;
      font-size: 1rem;
    }
    .search-input { flex: 2; }
    .category-select { flex: 1; }
    
    .notices-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .notice-card {
      background: white; border-radius: 8px; padding: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s;
      border-left: 4px solid #3f51b5;
    }
    .notice-card:hover { transform: translateY(-4px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .notice-card.important { border-left-color: #f44336; }
    
    .notice-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px; }
    .notice-header h3 { margin: 0; font-size: 1.1rem; color: #333; }
    .badge {
      padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;
    }
    .badge.exam { background: #ffebee; color: #c62828; }
    .badge.holiday { background: #e8f5e9; color: #2e7d32; }
    .badge.general { background: #e3f2fd; color: #1565c0; }
    .badge.academic { background: #fff3e0; color: #ef6c00; }
    .badge.event { background: #f3e5f5; color: #7b1fa2; }
    
    .notice-desc { color: #555; line-height: 1.5; margin-bottom: 15px; }
    .notice-meta { display: flex; flex-wrap: wrap; gap: 15px; font-size: 0.85rem; color: #777; margin-bottom: 15px; }
    
    .notice-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .notice-actions button {
      background: #f5f5f5; border: none; padding: 8px 12px;
      border-radius: 4px; cursor: pointer; transition: background 0.2s;
    }
    .notice-actions button:hover { background: #e0e0e0; }
    .notice-actions button.active { background: #fff3cd; }
    .edit-btn:hover { background: #e3f2fd; }
    .delete-btn:hover { background: #ffebee; }
    
    .empty { grid-column: 1/-1; text-align: center; padding: 40px; color: #999; }
  `]
})
export class NoticeListComponent {
  noticeService = inject(NoticeService);
  searchTerm = signal('');
  selectedCategory = signal<NoticeCategory | 'All'>('All');
  categories: (NoticeCategory | 'All')[] = ['All', ...CATEGORIES];

  filteredNotices = computed(() => {
    let notices = this.noticeService.notices();
    if (this.selectedCategory() !== 'All') {
      notices = notices.filter(n => n.category === this.selectedCategory());
    }
    const search = this.searchTerm().toLowerCase();
    if (search) {
      notices = notices.filter(n => 
        n.title.toLowerCase().includes(search) || 
        n.description.toLowerCase().includes(search)
      );
    }
    return notices.sort((a, b) => {
      if (a.important !== b.important) return b.important ? 1 : -1;
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });
  });

  onSearch(term: string) { this.searchTerm.set(term); }
  onCategoryChange(category: string) { this.selectedCategory.set(category as NoticeCategory | 'All'); }
  
  deleteNotice(id: number) {
    if (confirm('Delete this notice?')) {
      this.noticeService.deleteNotice(id);
    }
  }
  
  toggleImportant(id: number) {
    this.noticeService.toggleImportant(id);
  }
}