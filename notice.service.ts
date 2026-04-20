import { Injectable, signal, computed } from '@angular/core';
import { Notice, NoticeCategory } from '../models/notice';

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private noticesSignal = signal<Notice[]>(this.getInitialNotices());
  
  readonly notices = computed(() => this.noticesSignal());
  readonly totalNotices = computed(() => this.noticesSignal().length);
  readonly importantNotices = computed(() => this.noticesSignal().filter(n => n.important));

  private getInitialNotices(): Notice[] {
    const today = new Date();
    return [
      {
        id: 1,
        title: 'Mid-Term Examination Schedule',
        description: 'Mid-term examinations will be held from 15th to 20th November. Students must bring their ID cards.',
        category: 'Exam',
        important: true,
        createdDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2),
        validUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
        postedBy: 'Admin'
      },
      {
        id: 2,
        title: 'Diwali Holiday Notice',
        description: 'Institute will remain closed from 1st to 5th November on account of Diwali festival.',
        category: 'Holiday',
        important: true,
        createdDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5),
        validUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        postedBy: 'Admin'
      },
      {
        id: 3,
        title: 'Guest Lecture on AI',
        description: 'Dr. Smith from MIT will conduct a guest lecture on Artificial Intelligence on 25th November at 2 PM.',
        category: 'Event',
        important: false,
        createdDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1),
        validUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7),
        postedBy: 'Department'
      },
      {
        id: 4,
        title: 'Library Timings During Exams',
        description: 'Library will remain open from 8 AM to 10 PM during examination period.',
        category: 'General',
        important: false,
        createdDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 3),
        validUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15),
        postedBy: 'Library'
      },
      {
        id: 5,
        title: 'Assignment Submission Deadline',
        description: 'Last date for submitting Python Programming assignment is 30th November.',
        category: 'Academic',
        important: true,
        createdDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        validUntil: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5),
        postedBy: 'Faculty'
      }
    ];
  }

  getNoticeById(id: number): Notice | undefined {
    return this.noticesSignal().find(n => n.id === id);
  }

  getNoticesByCategory(category: NoticeCategory | 'All'): Notice[] {
    if (category === 'All') return this.noticesSignal();
    return this.noticesSignal().filter(n => n.category === category);
  }

  addNotice(notice: Omit<Notice, 'id' | 'createdDate'>): void {
    const newNotice: Notice = {
      ...notice,
      id: Date.now(),
      createdDate: new Date()
    };
    this.noticesSignal.update(notices => [newNotice, ...notices]);
  }

  updateNotice(id: number, updatedNotice: Partial<Notice>): void {
    this.noticesSignal.update(notices => 
      notices.map(n => n.id === id ? { ...n, ...updatedNotice } : n)
    );
  }

  deleteNotice(id: number): void {
    this.noticesSignal.update(notices => notices.filter(n => n.id !== id));
  }

  toggleImportant(id: number): void {
    this.noticesSignal.update(notices =>
      notices.map(n => n.id === id ? { ...n, important: !n.important } : n)
    );
  }
}