export enum SearchType {
  COMMUNITY,
  USER,
}

export enum CommunityFilterType {
  JOINED = 'joined',
  OWNED = 'owned',
  FAVOURITE = 'favourite',
}

export enum NotificationKind {
  MENTION = 'mention',
  START_FOLLOW = 'start_follow',
  COMMUNITY_NEW_MEMBER = 'community_new_member',
  POST_COMMENT = 'post_comment',
  COMMENT_REPLY = 'comment_reply',
}