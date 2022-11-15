export enum NoticeTypes {
  HANDOUT = 'Aviso',
  MEETING = 'Reunião',
}

export type NoticeType = {
  id: number;
  type: NoticeTypes;
};

export function findNoticeTypeById(noticeTypes: NoticeType[], id: number): NoticeType | undefined {
  return noticeTypes.find((type) => type.id === id);
}
