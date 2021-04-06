// interfaces
import { IComment } from './Comment';
import { ILike } from './Like';
import { IUser } from './User';

export interface IPost {
	_id?: string;
	body: string;
	username: string;
	createdAt: string;
	comments: IComment[];
	commentCount?: number;
	likeCount?: number;
	likes: ILike[];
	user: IUser;
}
