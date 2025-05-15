
export interface NodeBasicInfo {
  id: string;
  title: string;
  type: "note" | "task" | "event";
}

export interface LinkInfo {
  id?: string;
  source_id: string;
  target_id: string;
  type?: string;
}

export interface LinkData {
  id: string;
  source_id: string;
  target_id: string;
  source?: NodeBasicInfo;
  target?: NodeBasicInfo;
  type?: string;
}

export interface CreateLinkParams {
  source_id: string;
  target_id: string;
  type?: string;
}

export interface UpdateLinksParams {
  sourceId: string;
  targetIds: string[];
  type?: string;
}
