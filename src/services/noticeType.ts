export enum NoticeTypes {
  HANDOUT = 'Comunicado',
  MEETING = 'Reunião',
}

export type NoticeType = {
  id: number;
  type: NoticeTypes;
};

export function findNoticeTypeById(noticeTypes: NoticeType[], id: number) {
  return noticeTypes?.find((type) => type.id === id);
}
