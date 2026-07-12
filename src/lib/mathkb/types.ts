export interface MathKbTag {
  name: string;
  noteCount: number;
  slug: string;
}

export interface MathKbField {
  name: string;
  noteCount: number;
}

export interface MathKbNoteListItem {
  field: string;
  slug: string;
  summary: string;
  tags: MathKbTag[];
  title: string;
  updatedAt: string;
}

export interface MathKbNoteDetail extends MathKbNoteListItem {
  bodyMarkdown: string;
  bodyPlain: string;
  createdAt: string;
  isPublic: boolean;
}

export interface MathKbSearchFilters {
  field: string;
  limit: number;
  page: number;
  query: string;
  tag: string;
}

export interface MathKbSearchResult {
  notes: MathKbNoteListItem[];
  totalFilteredNotes: number;
}
