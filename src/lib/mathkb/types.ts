export interface MathKbTag {
  name: string;
  noteCount?: number;
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
  query: string;
  tag: string;
  view?: "card" | "list";
}

export interface MathKbHomeData {
  fields: MathKbField[];
  filters: MathKbSearchFilters;
  notes: MathKbNoteListItem[];
  tags: MathKbTag[];
  totalNotes: number;
}

export interface MathKbSetupState {
  message: string;
  status: "setup";
}

export interface MathKbReadyState {
  data: MathKbHomeData;
  status: "ready";
}

export type MathKbHomeState = MathKbReadyState | MathKbSetupState;

export interface MathKbNoteReadyState {
  note: MathKbNoteDetail;
  status: "ready";
}

export interface MathKbNoteMissingState {
  status: "missing";
}

export type MathKbNoteState =
  | MathKbNoteMissingState
  | MathKbNoteReadyState
  | MathKbSetupState;
