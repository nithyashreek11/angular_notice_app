export type NoticeCategory = 'General' | 'Exam' | 'Holiday' | 'Academic' | 'Event';

export interface Notice {
  id: number;
  title: string;
  description: string;
  category: NoticeCategory;
  important: boolean;
  createdDate: Date;
  validUntil: Date;
  postedBy: string;
}

export const CATEGORIES: NoticeCategory[] = ['General', 'Exam', 'Holiday', 'Academic', 'Event'];