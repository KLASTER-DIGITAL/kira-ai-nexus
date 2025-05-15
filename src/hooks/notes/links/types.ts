
export interface NodeBasicInfo {
  id: string;
  title: string;
  type: string;
}

export interface LinkData {
  id: string;
  source_id: string;
  target_id: string;
  type: string;
  source?: NodeBasicInfo;
  target?: NodeBasicInfo;
}

export interface LinksResult {
  incomingLinks: LinkData[];
  outgoingLinks: LinkData[];
}

export interface CreateLinkParams {
  sourceId: string;
  targetId: string;
  type?: string;
}
