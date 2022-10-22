import { WatchLabelEntity } from './watch-label';

export class IWatch<T> {
  id: number;

  label_id: number;

  label: WatchLabelEntity;

  value: T;

  time: Date;
}
